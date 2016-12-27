// @flow
import _ from 'lodash'
import {Route} from '../data/flowtypes'
import {getEstimatedTimesOfDeparture} from '../api'
import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'

const DEFAULT_NUM_SUGGESTIONS = 5
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

const _getBackwardsTrains = (origin:string, etdsLookup:{[id:string]: Object}, targetRouteIds:string[]) => {
    let etdsForOrigin = etdsLookup[origin].etd
    let originStationInfo = stationsLookup[origin]
    let backwardsRouteDestinations = new Set(
        _STATION_ROUTE_DIRECTIONS
            // get the list of route IDs in either direction
            .map((routeDirection) => originStationInfo[routeDirection])

            // find the route IDs in that are in the opposite direction by seeing
            // if the targetRouteIds are NOT in the routes for the direction
            .find((routesInDirection) => _(routesInDirection).intersection(targetRouteIds).isEmpty())

            // transform those opposite routeIDs into their final destinations
            // (for easy lookup later)
            .map((routeId) => routesLookup[routeId].destination)
    )

    return _(etdsForOrigin)
        // take ETDs grouped by destination & filter down trains to the ones
        // going in the opposite direction by looking to see if the train's
        // destination is in the backwardsRouteDestinations
        .filter((destinationEtdInfo) => backwardsRouteDestinations.has(destinationEtdInfo.abbreviation))

        // for each set of ETDs for the destinations going in the opposite direction
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

        .map((trainInfo) => ({
            ...trainInfo,
            arrivalTime: _normalizeMinutes(trainInfo.minutes),
            routeID: _(routesLookup)
                .values()
                .find(({destination, color}) => (
                    trainInfo.abbreviation === destination && trainInfo.hexcolor === color
                ))
                .routeID
        }))
}

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
            let routeID = trainInfo.routeID
            let routeForTrain = routesLookup[routeID]
            let stationsForTrain = routeForTrain.stations

            return _(stationsForTrain)
                // get all the stations after the origin
                .takeRightWhile(({name}) => name !== origin)

                // merge in the train information plus the time it takes from
                // origin to station (backwardsTime)
                .map(({name}) => ({
                    ...trainInfo,
                    backwardsStationName: name,
                    backwardsTime: _minutesBetweenStation(origin, name, routeID)
                }))

                // TODO: Remove for potential optimization
                .value()
        })

        // flatten out the nested list to get a list of backwards route paths
        // that include info on how long it takes to get to the backwards station
        .flatten()
)

export const getSalmonSuggestions = async (origin:string, destination:string, numSuggestions:number = DEFAULT_NUM_SUGGESTIONS): Promise<any[]> => {
    let etdsLookup = await getEstimatedTimesOfDeparture()

    // 1. Determine the desired routes based on the origin/destination
    // (w/o making a "trip" API request)
    let targetRouteIds = _determineRouteIdsFromOrigin(origin, destination)

    // console.log(targetRouteIds)

    // 2. Generate a list of the trains heading in the OPPOSITE direction w/
    // their arrival times (arrivalTime)
    let _backwardsTrains = _getBackwardsTrains(origin, etdsLookup, targetRouteIds)

    // console.log(_backwardsTrains.value())

    // 3. For each train, determine the estimated time it would take to get to
    // each following station in its route (backwardsTime)
    let _backwardsTimeRoutePaths = _getBackwardsTimeRoutePaths(_backwardsTrains, origin)

    // console.log(_backwardsTimeRoutePaths.value())

    // 4. For each train at each station, determine the estimated wait time until
    // targetRouteId arrives at that station (waitTime)

    // 5. For each train at each station after waiting, determine estimated time
    // it would take to return to the origin on target route (returnTime)

    // 6. Add up arrivalTime + backwardsTime + waitTime + returnTime for each
    // backwards/return route pair and add to list of suggestions

    // 7. Sort by ascending time and take the first numSuggestions suggestions

    return []
}
