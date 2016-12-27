// @flow
import _ from 'lodash'
import {Route} from '../data/flowtypes'
import {getEstimatedTimesOfDeparture} from '../api'
import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'

// default number of salmon suggestions to return
const DEFAULT_NUM_SUGGESTIONS = 5

// minimum number of minutes to wait at the backwards station
// the higher this number is the more likely to make the train
const MINIMUM_BACKWARDS_STATION_WAIT_TIME = 1

const _STATION_ROUTE_DIRECTIONS = _(['northRoutes', 'southRoutes'])

const _routeStationPredicate = (target, {name}) => name === target

const _determineRouteIdsFromOrigin = (origin:string, destination:string):string[] => (
    _(routesLookup)
        .values()
        // if the route is valid its stations list will have both the origin and destination in it
        // with origin coming before destination
        .filter(({stations}:Route) => {
            let originIndex = stations.findIndex(_routeStationPredicate.bind(null, origin))
            let destinationIndex = stations.findIndex(_routeStationPredicate.bind(null, destination))

            return originIndex > -1 && originIndex < destinationIndex
        })
        .map(({routeID}) => routeID)
        .value()
)

const _normalizeMinutes = (minutes:mixed):number => (
    Number.isNaN(minutes) ? 0 : +minutes
)

const _getBackwardsRoutesDestinations = (
    stationName: string,
    targetRouteIds: string[]
): Set<string> => {
    let stationInfo = stationsLookup[stationName]

    return new Set(
        _STATION_ROUTE_DIRECTIONS
            // get the list of route IDs in either direction
            .map((routeDirection) => stationInfo[routeDirection])

            // find the route IDs in that are in the opposite direction by seeing
            // if the targetRouteIds are NOT in the routes for the direction
            .find((routesInDirection) => _(routesInDirection).intersection(targetRouteIds).isEmpty())

            // transform those opposite routeIDs into their final destinations
            // (for easy lookup later)
            .map((routeId) => routesLookup[routeId].destination)
    )
}

const _getReturnRouteDestinations = (targetRouteIds: string[]): Set<string> => new Set(
    targetRouteIds.map((routeID) => routesLookup[routeID].destination)
)

const _getRouteDestinations = (
    stationName: string,
    targetRouteIds: string[],
    isOpposite: boolean
): Set<string> => (
    isOpposite
        ? _getBackwardsRoutesDestinations(stationName, targetRouteIds)
        : _getReturnRouteDestinations(targetRouteIds)
)

const _genFlattenedDestinationEtdsForStation = (
    stationName: string,
    etdsLookup:{[id:string]: Object},
    targetRouteIds: string[],
    isOpposite: boolean = false
) => {
    let routeDestinations = _getRouteDestinations(stationName, targetRouteIds, isOpposite)
    let etdsForStation = etdsLookup[stationName].etd

    return _(etdsForStation)
        // take ETDs grouped by destination & filter down trains to the ones
        // going in specified route direction by looking to see if the train's
        // destination is in the routeDestinations
        .filter((destinationEtdInfo) => routeDestinations.has(destinationEtdInfo.abbreviation))

        // for each set of ETDs for the destinations going in the route direction
        // add the destination info to the ETD info
        .map((destinationEtdInfo) => (
            // TODO: Make this map a lodash sequence for performance optimization
            destinationEtdInfo.estimate.map((estimate) => (
                _(destinationEtdInfo)
                    .omit(['estimate'])
                    .merge(estimate)
                    .value()
            ))
        ))

        // flatten out the groupings (now that each one has the destination info)
        .flatten()
}

const _getRouteIDFromTrainInfo = ({abbreviation, hexcolor}) => (
    _(routesLookup)
        .values()
        .find(({destination, color}) => (abbreviation === destination && hexcolor === color))
        .routeID
)

const _getBackwardsTrains = (origin:string, etdsLookup:{[id:string]: Object}, targetRouteIds:string[]) => (
    _genFlattenedDestinationEtdsForStation(origin, etdsLookup, targetRouteIds, true)
        .map((trainInfo) => ({
            backwardsTrain: trainInfo,
            waitTime: _normalizeMinutes(trainInfo.minutes),
            backwardsRouteID: _getRouteIDFromTrainInfo(trainInfo)
        }))
)

const _minutesBetweenStation = (start, end, routeID) => {
    let routeStations = routesLookup[routeID].stations
    let startRouteStationInfo = routeStations.find(_routeStationPredicate.bind(null, start))
    let endRouteStationInfo = routeStations.find(_routeStationPredicate.bind(null, end))

    return endRouteStationInfo.timeFromOrigin - startRouteStationInfo.timeFromOrigin
}

const _getBackwardsTimeRoutePaths = (_backwardsTrains, origin:string) => (
    _backwardsTrains
        // for each backwards train, return a (nested) list of route paths
        // from origin to stations after origin (including time to get to that
        // station)
        .map((trainInfo) => {
            let routeID = trainInfo.backwardsRouteID
            let routeForTrain = routesLookup[routeID]
            let stationsForTrain = routeForTrain.stations

            return _(stationsForTrain)
                // get all the stations after the origin
                .takeRightWhile(({name}) => name !== origin)

                // merge in the train information plus the time it takes from
                // origin to station (backwardsRideTime)
                .map(({name}) => ({
                    ...trainInfo,
                    backwardsStation: name,
                    backwardsRideTime: _minutesBetweenStation(origin, name, routeID)
                }))

                // TODO: Remove for potential optimization?
                .value()
        })

        // flatten out the nested list to get a list of backwards route paths
        // that include info on how long it takes to get to the backwards station
        .flatten()
)

const _getWaitTimesForBackwardsTimeRoutePaths = (_backwardsTimeRoutePaths, etdsLookup:{[id:string]: Object}, targetRouteIds:string[]) => (
    // for each backwards train, calculate how long it'll take to get to the
    // backwards station (waitTime + backwardsRideTime), then find all of the
    // arrivals to that backwards station within targetRouteIds. Need to filter
    // down to only arrivals to the backwards station that are greater than
    // (waitTime + backwardsRideTime). The valid backwards train arrival time
    // (backwardsArrivalTime) minus (waitTime + backwardsRideTime) is backwardsWaitTime
    _backwardsTimeRoutePaths
        .map((trainInfo) => {
            let {waitTime, backwardsRideTime, backwardsStation} = trainInfo
            let timeToBackwardsStation = waitTime + backwardsRideTime

            return _genFlattenedDestinationEtdsForStation(backwardsStation, etdsLookup, targetRouteIds)
                // after getting all the returning trains on the target routes,
                // include the wait time at the backwards station (negative values
                // mean that there isn't enough time to make it)
                .map((returnTrainInfo) => ({
                    ...trainInfo,
                    returnTrain: returnTrainInfo,
                    backwardsWaitTime: _normalizeMinutes(returnTrainInfo.minutes) - timeToBackwardsStation,
                    returnRouteID: _getRouteIDFromTrainInfo(returnTrainInfo)
                }))

                // only include the trains where the wait time at the backwards
                // station is greater that the minimum allowable to increase the
                // likelihood of making the train
                .filter(({backwardsWaitTime}) => backwardsWaitTime >= MINIMUM_BACKWARDS_STATION_WAIT_TIME)

                // TODO: Remove for potential optimization?
                .value()
        })
        .flatten()
)

const _getSalmonTimeRoutePaths = (_backwardsTimeRoutePathsWithWaits, origin: string) => (
    _backwardsTimeRoutePathsWithWaits
        .map((trainInfo) => ({
            ...trainInfo,
            returnRideTime: _minutesBetweenStation(
                trainInfo.backwardsStation,
                origin,
                trainInfo.returnRouteID
            )
        }))
)

export const getSalmonSuggestions = async (origin: string, destination: string, numSuggestions: number = DEFAULT_NUM_SUGGESTIONS): Promise<any[]> => {
    let etdsLookup = await getEstimatedTimesOfDeparture()

    // 1. Determine the desired routes based on the origin/destination
    // (w/o making a "trip" API request)
    let targetRouteIds = _determineRouteIdsFromOrigin(origin, destination)

    // console.log(targetRouteIds)

    // 2. Generate a list of the trains heading in the OPPOSITE direction w/
    // their arrival times (waitTime)
    let _backwardsTrains = _getBackwardsTrains(origin, etdsLookup, targetRouteIds)

    // console.log(_backwardsTrains.value())
    // console.log(_backwardsTrains.size())

    // 3. For each train, determine the estimated time it would take to get to
    // each following station in its route (backwardsRideTime)
    let _backwardsTimeRoutePaths = _getBackwardsTimeRoutePaths(_backwardsTrains, origin)

    // console.log(_backwardsTimeRoutePaths.value())
    // console.log(_backwardsTimeRoutePaths.size())

    // 4. For each train at each station, determine the estimated wait time until
    // targetRouteId arrives at that station (backwardsWaitTime)
    let _backwardsTimeRoutePathsWithWaits = _getWaitTimesForBackwardsTimeRoutePaths(
        _backwardsTimeRoutePaths,
        etdsLookup,
        targetRouteIds
    )

    // console.log(_backwardsTimeRoutePathsWithWaits.value())
    // console.log(_backwardsTimeRoutePathsWithWaits.size())

    // 5. For each train at each station after waiting, determine estimated time
    // it would take to return to the origin on target route (returnRideTime)

    let _salmonTimeRoutePaths = _getSalmonTimeRoutePaths(_backwardsTimeRoutePathsWithWaits, origin)

    // console.log(_salmonTimeRoutePaths.value())

    // 6. Add up waitTime + backwardsRideTime + backwardsWaitTime + returnTime for each
    // backwards/return route pair and add to list of suggestions

    // 7. Sort by ascending time and take the first numSuggestions suggestions

    return []
}
