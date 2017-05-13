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
 * for a route with origin coming before destination
 */
export const areStationsOnRouteStations = (start: StationName, end: StationName, stations: RouteStation[]): boolean => {
    let startIndex = stations.findIndex(isStationARouteStation.bind(null, start))
    let endIndex = stations.findIndex(isStationARouteStation.bind(null, end))

    return startIndex > -1 && startIndex < endIndex
}

/**
 * Given start and ends stations, returns the routes that directly connect the two stations
 */
export const getRouteIdsWithStartAndEnd = (start: StationName, end: StationName, trainColor: ?string = undefined): RouteId[] => {
    let routesInfo = stationRoutesLookup[start][end] || {}
    let {directRoutes = []} = routesInfo

    return (
        // get all of the routes that directly connect the two stations
        (directRoutes || [])
            // optionally filter down to routes that match the optional trainColor
            .filter((routeId: RouteId): boolean => !trainColor || routesLookup[routeId].color === trainColor)
    )
}

/**
 * Given a list of route IDs and a source station returns a list of potential
 * train destination stations
 */
export const getAllDestinationsFromRoutes = (sourceStation: StationName, routeIds: RouteId[]): Set<StationName> => new Set (
    _(routeIds)
        // filter the route IDs to the ones that actually contain the sourceStation
        .filter((routeId: RouteId) => (
            routesLookup[routeId].stations.find((routeStation: RouteStation) => (
                routeStation.name === sourceStation
            ))
        ))

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

/**
 * Given a source station gets the routes going in the opposite direction of the
 * specified targetRouteIds
 */
export const getOppositeRouteIds = (sourceStation: StationName, targetRouteIds: RouteId[]): RouteId[] => {
    let stationInfo = stationsLookup[sourceStation]

    return _STATION_ROUTE_DIRECTIONS
        // get the list of route IDs in either direction
        .map((routeDirection) => stationInfo[routeDirection])

        // find the route IDs that are in the opposite direction by seeing
        // if the targetRouteIds are NOT in the routes for the direction
        .find((routesInDirection) => _(routesInDirection).intersection(targetRouteIds).isEmpty())
}

/**
 * Given an origin and destination station, returns the routes that contain both,
 * optionally using routes that would require transfers
 */
export const getTargetRouteIds = (origin: StationName, destination: StationName, allowTransfers: ?boolean = false): RouteId[] => {
    let stationRoutesInfo = stationRoutesLookup[origin][destination]
    let targetRouteIds = stationRoutesInfo.directRoutes || []
    let useMultiRoutes = allowTransfers && stationRoutesInfo.multiRoutes

    // If targetRouteIds is empty, there is no direct route that connects the two
    // stations so we need to find *start* route trains for multi-train routes
    if (useMultiRoutes) {
        let targetRouteIdsSet = new Set([
            ...targetRouteIds,
            ...stationRoutesInfo.multiRoutes.map(([startRouteId]) => startRouteId)
        ])

        targetRouteIds = [...targetRouteIdsSet]
    }

    return targetRouteIds
}
