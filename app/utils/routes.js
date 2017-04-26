// @flow
import _ from 'lodash'
import type {StationName, RouteId, RouteStation} from './flow'
import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'
import stationRoutesLookup from '../data/station-routes.json'

const _STATION_ROUTE_DIRECTIONS = _(['northRoutes', 'southRoutes'])

export const isStationARouteStation = (target: StationName, {name}: RouteStation): boolean => name === target

/*
 * Determines if the specified origin & destination are in the list of stations
 * (for a route) with origin coming before destination
 */
export const areStationsOnRouteStations = (start: StationName, end: StationName, stations: RouteStation[]): boolean => {
    let startIndex = stations.findIndex(isStationARouteStation.bind(null, start))
    let endIndex = stations.findIndex(isStationARouteStation.bind(null, end))

    return startIndex > -1 && startIndex < endIndex
}

/**
 * Given start and ends stations, returns the routes that directly connect the two stations
 */
export const getRouteIdsWithStartAndEnd = (start: StationName, end: StationName, trainColor: ?string = undefined): RouteId[] => (
    // get all of the routes that directly connect the two stations
    (stationRoutesLookup[start][end].directRoutes || [])
        // optionally filter down to routes that match the optional trainColor
        .filter((routeId: RouteId): boolean => !trainColor || routesLookup[routeId].color === trainColor)
)

/**
 * Given a list of route IDs and a source station returns a list of potential
 * train destination stations
 */
export const getAllDestinationsFromRoutes = (sourceStation: StationName, routeIds: RouteId[]): Set<StationName> => new Set (
    _(routeIds)
        // transform each routeId into a nested list of potential train destinations
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

const _getBackwardsRoutesDestinations = (sourceStation: StationName, targetRouteIds: RouteId[]): Set<StationName> => {
    let stationInfo = stationsLookup[sourceStation]
    let backwardsRouteIds = _STATION_ROUTE_DIRECTIONS
        // get the list of route IDs in either direction
        .map((routeDirection) => stationInfo[routeDirection])

        // find the route IDs in that are in the opposite direction by seeing
        // if the targetRouteIds are NOT in the routes for the direction
        .find((routesInDirection) => _(routesInDirection).intersection(targetRouteIds).isEmpty())

    return getAllDestinationsFromRoutes(sourceStation, backwardsRouteIds)
}

const _getReturnRouteDestinations = (sourceStation: StationName, targetRouteIds: RouteId[]): Set<StationName> => (
    getAllDestinationsFromRoutes(sourceStation, targetRouteIds)
)

/**
 * Given a current station and a set of target routes, returns a list of possible
 * train destinations either in the direction of each of the target routes or the
 * opposite
 */
export const getPossibleRouteDestinations = (
    stationName: StationName,
    targetRouteIds: RouteId[],
    isOpposite: boolean
): Set<StationName> => (
    isOpposite
        ? _getBackwardsRoutesDestinations(stationName, targetRouteIds)
        : _getReturnRouteDestinations(stationName, targetRouteIds)
)

/**
 * Given an origin and destination station, returns the routes that contain both,
 * optionally using routes that would require transfers
 */
export const getTargetRouteIds = (origin: StationName, destination: StationName, allowTransfers: ?boolean = false): RouteId[] => {
    let stationRoutesInfo = stationRoutesLookup[origin][destination]
    let targetRouteIds = stationRoutesInfo.directRoutes || []

    // If targetRouteIds is empty, there is no direct route that connects the two
    // stations so we need to find *start* route trains for multi-train routes
    if ((allowTransfers || _.isEmpty(targetRouteIds)) && stationRoutesInfo.multiRoutes) {
        targetRouteIds = stationRoutesInfo.multiRoutes.map(([startRouteId]) => startRouteId)
    }

    return targetRouteIds
}
