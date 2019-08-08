import {
  StationName,
  RouteId,
  StationRoutesLookup,
  RoutesLookup,
  StationLookup,
  Direction,
  HexColor,
  Train,
} from './types'
import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'
import stationRoutesLookup from '../data/station-routes.json'


const STATION_ROUTES_LOOKUP = (stationRoutesLookup as unknown) as StationRoutesLookup
const ROUTES_LOOKUP = (routesLookup as unknown) as RoutesLookup
const STATIONS_LOOKUP = (stationsLookup as unknown) as StationLookup


const DEFAULT_MINUTES_BETWEEN_STATIONS = 1000


/**
 * Determines if the specified origin & destination are in the list of stations
 * for a route with origin coming before destination
 */
export const areStationsOnRouteStations = (
  start: StationName,
  end: StationName,
  stations: StationName[],
): boolean => {
  let startIndex = stations.findIndex((station) => station === start)
  let endIndex = stations.findIndex((station) => station === end)

  return startIndex > -1 && startIndex < endIndex
}

/**
 * Given start and ends stations, returns the routes that directly connect the two stations
 */
export const getRouteIdsWithStartAndEnd = (
  start: StationName,
  end: StationName,
  trainColor?: HexColor,
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
 * Given a source station gets the routes going in the opposite direction of the
 * specified targetRouteIds
 */
export const getOppositeRouteIds = (
  sourceStation: StationName,
  targetRouteIds: Set<RouteId>,
): Set<RouteId> => {
  if (!targetRouteIds.size) {
    return new Set()
  }

  const stationInfo = STATIONS_LOOKUP[sourceStation]
  const targetDirections = getTargetDirections(sourceStation, targetRouteIds)
  const oppositeRouteIds: RouteId[] = []

  if (targetDirections.has('North')) {
    oppositeRouteIds.push(...stationInfo.southRoutes)
  }
  if (targetDirections.has('South')) {
    oppositeRouteIds.push(...stationInfo.northRoutes)
  }

  return new Set(oppositeRouteIds)
}

/**
 * Given an origin and destination station, returns the routes that contain both,
 * optionally using routes that would require transfers
 */
export const getTargetRouteIds = (
  origin: StationName,
  destination: StationName,
  allowTransfers: boolean = false,
): Set<RouteId> => {
  const stationRoutesInfo = STATION_ROUTES_LOOKUP[origin][destination]
  const { directRoutes: targetRouteIds, multiRoutes } = stationRoutesInfo

  // If targetRouteIds is empty, there is no direct route that connects the two
  // stations so we need to find *start* route trains for multi-train routes
  if (allowTransfers && multiRoutes.length) {
    targetRouteIds.push(
      ...stationRoutesInfo.multiRoutes.map(([startRouteId]) => startRouteId),
    )
  }

  return new Set(targetRouteIds)
}

/**
 * Given a station and a list of target route IDs,
 * gets the set of directions for the routes
 */
export const getTargetDirections = (
  station: StationName,
  targetRouteIds: Set<RouteId>,
): Set<Direction> => {
  const stationInfo = STATIONS_LOOKUP[station]
  const northRoutes = new Set(stationInfo.northRoutes)
  const southRoutes = new Set(stationInfo.southRoutes)

  return (
    new Set(
      [...targetRouteIds]
        .map((routeId) => (
          northRoutes.has(routeId)
            ? 'North'
            : (southRoutes.has(routeId) ? 'South' : undefined)
        ))
        .filter((direction) => !!direction) as Direction[]
    )
  )
}

/**
 * Calculates the minutes between two stations on a given route.
 * Returns 1000 if stations are not connected by the route
 */
export const minutesBetweenStation = (
  start: StationName,
  end: StationName,
  routeId: RouteId,
): number => {
  const {
    directRoutes = [],
    time = DEFAULT_MINUTES_BETWEEN_STATIONS,
  } = STATION_ROUTES_LOOKUP[start][end] || {}

  if (!directRoutes.includes(routeId)) {
    return DEFAULT_MINUTES_BETWEEN_STATIONS;
  }

  return time
}

/**
 * A filter that will include a train that will actually go all the way to the
 * destination if we want direct routes (!allowTransfers). For instance
 * the NCON/PHIL trains have the same route ID as the PITT train, so
 * they'll be returned. However, they don't make it all the way to PITT
 * so they shouldn't be included
 */
export const filterForTrainsThatGoAllTheWay = (
  targetRouteIds: Set<RouteId>,
  allowTransfers: boolean,
  { abbreviation: trainDestination, hexcolor: trainColor }: Train,
  destination?: StationName,
): boolean => {
  // If we're allowing transfers or the train ends in the destination
  // then this arrival train is good to include.
  if (allowTransfers || !destination || trainDestination === destination) {
    return true
  }

  // Otherwise we determine if the train will "go all the way" by seeing
  // if we can get from our destination to the train's destination.
  // We get back a list of routes, which we intersect with the targetRouteIds
  // to doubly ensure that this arrival train is ok. If the intersection
  // is non empty we know the train "goes all the way".
  const routesFromDestinationToTrainEnd = getRouteIdsWithStartAndEnd(
    destination,
    trainDestination,
    trainColor,
  )

  return routesFromDestinationToTrainEnd.some((routeId) => targetRouteIds.has(routeId))
}
