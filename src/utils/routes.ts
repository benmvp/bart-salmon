import _ from 'lodash'
import {
  StationName,
  RouteId,
  RouteStation,
  StationRoutesLookup,
  RoutesLookup,
  StationLookup,
} from './types'
import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'
import stationRoutesLookup from '../data/station-routes.json'


const STATION_ROUTES_LOOKUP = (stationRoutesLookup as unknown) as StationRoutesLookup
const ROUTES_LOOKUP = (routesLookup as unknown) as RoutesLookup
const STATIONS_LOOKUP = (stationsLookup as unknown) as StationLookup


export const isStationARouteStation = (
  target: StationName,
  { name }: RouteStation,
): boolean => name === target

/*
 * Determines if the specified origin & destination are in the list of stations
 * for a route with origin coming before destination
 */
export const areStationsOnRouteStations = (
  start: StationName,
  end: StationName,
  stations: RouteStation[],
): boolean => {
  let startIndex = stations.findIndex(isStationARouteStation.bind(null, start))
  let endIndex = stations.findIndex(isStationARouteStation.bind(null, end))

  return startIndex > -1 && startIndex < endIndex
}

/**
 * Given start and ends stations, returns the routes that directly connect the two stations
 */
export const getRouteIdsWithStartAndEnd = (
  start: StationName,
  end: StationName,
  trainColor?: string,
): RouteId[] => {
  const routesInfo = STATION_ROUTES_LOOKUP[start][end] || {}
  const { directRoutes = [] } = routesInfo

  return (
    // get all of the routes that directly connect the two stations
    directRoutes
      // optionally filter down to routes that match the optional trainColor
      .filter(
        (routeId: RouteId): boolean =>
          !trainColor || ROUTES_LOOKUP[routeId].hexcolor === trainColor,
      )
  )
}

/**
 * Given a list of route IDs and a source station returns a list of potential
 * train destination stations
 */
export const getAllDestinationsFromRoutes = (
  sourceStation: StationName,
  routeIds: RouteId[],
): Set<StationName> =>
  new Set(
    _(routeIds)
      // filter the route IDs to the ones that actually contain the sourceStation
      .filter((routeId) =>
        !!ROUTES_LOOKUP[routeId].stations.find(
          (routeStation) => routeStation.name === sourceStation,
        ),
      )
      // transform each routeId into a nested list of potential train destinations
      .map(routeId =>
        _(ROUTES_LOOKUP[routeId].stations)
          // For all the stations for the given route, filter down to just
          // the stations *after* the source station. These are the possible
          // train destinations
          .takeRightWhile(({ name }) => name !== sourceStation)
          // just give back the station names
          .map(({ name }) => name)
          .value(),
      )
      // flatten out the list
      .flatten()
      .value(),
  )

/**
 * Given a source station gets the routes going in the opposite direction of the
 * specified targetRouteIds
 */
export const getOppositeRouteIds = (
  sourceStation: StationName,
  targetRouteIds: RouteId[],
): RouteId[] => {
  if (_.isEmpty(targetRouteIds)) {
    return []
  }

  const stationInfo = STATIONS_LOOKUP[sourceStation]

  // get the list of route IDs in either direction
  const oppositeRouteIds = [stationInfo.northRoutes, stationInfo.southRoutes]
    // find the route IDs that are in the opposite direction by seeing
    // if the targetRouteIds are NOT in the routes for the direction
    .find(routesInDirection =>
      _(routesInDirection)
        .intersection(targetRouteIds)
        .isEmpty()
    )

  return oppositeRouteIds || []
}

/**
 * Given an origin and destination station, returns the routes that contain both,
 * optionally using routes that would require transfers
 */
export const getTargetRouteIds = (
  origin: StationName,
  destination: StationName,
  allowTransfers: boolean = false,
): RouteId[] => {
  let stationRoutesInfo = STATION_ROUTES_LOOKUP[origin][destination]
  let targetRouteIds = stationRoutesInfo.directRoutes || []

  // If targetRouteIds is empty, there is no direct route that connects the two
  // stations so we need to find *start* route trains for multi-train routes
  if (allowTransfers && stationRoutesInfo.multiRoutes) {
    let targetRouteIdsSet = new Set([
      ...targetRouteIds,
      ...stationRoutesInfo.multiRoutes.map(([startRouteId]) => startRouteId),
    ])

    targetRouteIds = [...targetRouteIdsSet]
  }

  return targetRouteIds
}
