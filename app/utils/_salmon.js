// @flow
import _ from 'lodash'
import type {Route, SalmonRoute} from '../data/flowtypes'
import {forceArray} from './general'

import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'

// minimum number of minutes to wait at the backwards station
// the higher this number is the more likely to make the train
const MINIMUM_BACKWARDS_STATION_WAIT_TIME = 1

const _STATION_ROUTE_DIRECTIONS = _(['northRoutes', 'southRoutes'])

const _isStationARouteStation = (target, {name}): boolean => name === target

/*
 * Determines if the specified origin & destination are in the list of stations
 * (for a route) with origin coming before destination
 */
const _areStationsOnRouteStations = (start: string, end: string, stations): boolean => {
    let startIndex = stations.findIndex(_isStationARouteStation.bind(null, start))
    let endIndex = stations.findIndex(_isStationARouteStation.bind(null, end))

    return startIndex > -1 && startIndex < endIndex
}

const _determineRouteIdsFromOrigin = (origin: string, destination: string, trainColor: string = undefined):string[] => (
    _(routesLookup)
        .values()
        // if the route is valid its stations list will have both the origin and destination in it
        // with origin coming before destination
        .filter(({stations}:Route) => _areStationsOnRouteStations(origin, destination, stations))

        // optionally filter down to routes that match the optional trainColor
        .filter(({color}) => !trainColor || trainColor === color)

        // just pull out the routeID
        .map(({routeID}) => routeID)
        .value()
)

const _normalizeMinutes = (minutes:mixed):number => (
    Number.isNaN(minutes) ? 0 : +minutes
)

/*
 * Given a list of route IDs and a source station returns a list of potential
 * train destination stations
 */
const _getAllDestinationsFromRoutes = (sourceStation: string, routeIds: string[]): Set<string> => new Set (
    _(routeIds)
        // transform each routeID into a nested list of potential train destinations
        .map((routeId) => (
            _(routesLookup[routeId].stations)
                // For all the stations for the given route, filter down to just
                // the stations *after* the source station. These are the possible
                // train destinations
                .takeRightWhile(({name}) => name !== sourceStation)

                // just give back the station names
                .map(({name}) => name)
                .value()
        ))

        // flatten out the list
        .flatten()
)

const _getBackwardsRoutesDestinations = (sourceStation: string, targetRouteIds: string[]): Set<string> => {
    let stationInfo = stationsLookup[sourceStation]
    let backwardsRouteIds = _STATION_ROUTE_DIRECTIONS
        // get the list of route IDs in either direction
        .map((routeDirection) => stationInfo[routeDirection])

        // find the route IDs in that are in the opposite direction by seeing
        // if the targetRouteIds are NOT in the routes for the direction
        .find((routesInDirection) => _(routesInDirection).intersection(targetRouteIds).isEmpty())

    return _getAllDestinationsFromRoutes(sourceStation, backwardsRouteIds)
}

const _getReturnRouteDestinations = (sourceStation, targetRouteIds: string[]): Set<string> => (
    _getAllDestinationsFromRoutes(sourceStation, targetRouteIds)
)

/*
 * Given a curren station and a set of target routes, returns a list of possible
 * train destinations either in the direction of each of the target routes or the
 * opposite
 */
const _getPossibleRouteDestinations = (
    stationName: string,
    targetRouteIds: string[],
    isOpposite: boolean
): Set<string> => (
    isOpposite
        ? _getBackwardsRoutesDestinations(stationName, targetRouteIds)
        : _getReturnRouteDestinations(stationName, targetRouteIds)
)

const _genFlattenedDestinationEtdsForStation = (
    stationName: string,
    etdsLookup:{[id:string]: Object},
    targetRouteIds: string[],
    isOpposite: boolean = false
) => {
    let routeDestinations = _getPossibleRouteDestinations(stationName, targetRouteIds, isOpposite)
    let etdsForStation = etdsLookup[stationName].etd

    // console.log({stationName, targetRouteIds, routeDestinations, isOpposite, etdsForStation})

    return _(etdsForStation)
        // take ETDs grouped by destination & filter down trains to the ones
        // going in specified route direction by looking to see if the train's
        // destination is in the routeDestinations
        .filter((destinationEtdInfo) => routeDestinations.has(destinationEtdInfo.abbreviation))

        // for each set of ETDs for the destinations going in the route direction
        // add the destination info to the ETD info
        .map((destinationEtdInfo) => (
            forceArray(destinationEtdInfo.estimate)
                .map((estimate) => (
                    _(destinationEtdInfo)
                        .omit(['estimate'])
                        .merge(estimate)
                        .value()
                ))
        ))

        // flatten out the groupings (now that each one has the destination info)
        .flatten()
}

const _getBackwardsTrains = (origin:string, etdsLookup:{[id:string]: Object}, targetRouteIds:string[]) => (
    _genFlattenedDestinationEtdsForStation(origin, etdsLookup, targetRouteIds, true)
        .map((trainInfo) => ({
            backwardsTrain: trainInfo,
            waitTime: _normalizeMinutes(trainInfo.minutes),
            backwardsRouteID: _determineRouteIdsFromOrigin(origin, trainInfo.abbreviation, trainInfo.hexcolor)[0]
        }))
)

const _minutesBetweenStation = (start, end, routeID) => {
    let routeStations = routesLookup[routeID].stations
    let startRouteStationInfo = routeStations.find(_isStationARouteStation.bind(null, start))
    let endRouteStationInfo = routeStations.find(_isStationARouteStation.bind(null, end))

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
                    returnRouteID: _determineRouteIdsFromOrigin(backwardsStation, returnTrainInfo.abbreviation, returnTrainInfo.hexcolor)[0]
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
        .filter(({backwardsStation, returnRouteID}) => (
            _areStationsOnRouteStations(backwardsStation, origin, routesLookup[returnRouteID].stations)
        ))
        .map((trainInfo) => ({
            ...trainInfo,
            returnRideTime: _minutesBetweenStation(
                trainInfo.backwardsStation,
                origin,
                trainInfo.returnRouteID
            )
        }))
)

/*
 * Given origin and destination stations, returns a list of suggested salmon routes
 */
const getSuggestedSalmonRoutesFromETDs = (
    etdsLookup: {[id:string]: Object},
    origin: string,
    destination: string,
    numSuggestions: number
): SalmonRoute[] => {
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

    return _salmonTimeRoutePaths
        // 6. Add up waitTime + backwardsRideTime + backwardsWaitTime + returnRideTime
        // (salmonTime) for each salmon route path and sort by ascending total time
        // NOTE: This can be made significantly complicated to determine which routes
        // have most priority
        .sortBy([
            // first sort by salmonTime
            ({waitTime, backwardsRideTime, backwardsWaitTime, returnRideTime}) => (
                waitTime + backwardsRideTime + backwardsWaitTime + returnRideTime
            ),
            // then by wait time (for ties in salmonTime)
            ({waitTime, backwardsWaitTime}) => (waitTime + backwardsWaitTime)
        ])

        // 7. Take the first numSuggestions suggestions
        .take(numSuggestions)

        // 8. Sort again? With the set of suggestions, we may want to reprioritize...

        .value()
}

export default getSuggestedSalmonRoutesFromETDs
