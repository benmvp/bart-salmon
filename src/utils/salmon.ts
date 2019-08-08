import _ from 'lodash'
import {
  StationName,
  RouteId,
  SalmonRoute,
  Train,
  RoutesLookup,
  EtdsLookup,
  StationRoutesLookup,
} from './types'
import { normalizeMinutes } from './general'
import {
  getTargetRouteIds,
  getOppositeRouteIds,
  getRouteIdsWithStartAndEnd,
  areStationsOnRouteStations,
} from './routes'
import routesLookup from '../data/routes.json'
import stationRoutesLookup from '../data/station-routes.json'

const ROUTES_LOOKUP = (routesLookup as unknown) as RoutesLookup
const STATION_ROUTES_LOOKUP = (stationRoutesLookup as unknown) as StationRoutesLookup

const DEFAULT_NUM_SALMON_SUGGESTIONS = 5

// minimum number of minutes to wait at the backwards station
// the higher this number is the more likely to make the train
const DEFAULT_MINIMUM_BACKWARDS_STATION_WAIT_TIME = 1

/**
 * A filter that will include a train that will actually go all the way to the
 * destination if we want direct routes (!allowTransfers). For instance
 * the NCON/PHIL trains have the same route ID as the PITT train, so
 * they'll be returned. However, they don't make it all the way to PITT
 * so they shouldn't be included
 */
const _filterForTrainsThatGoAllTheWay = (
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

/**
 * Given the origin and the target route IDs, determines which trains
 * in the current ETDs are available to reach the specified destination.
 */
const _genDestinationEtdsForStation = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  targetRouteIds: Set<RouteId>,
  destination?: StationName,
  allowTransfers: boolean = false,
) => {
  const originETDInfo = etdsLookup[origin]
  const etdsForStation = originETDInfo ? originETDInfo.etd : []


  return (
    _(etdsForStation)
      // take ETDs (grouped by final destination) & filter down trains to the ones
      // on target routes by looking up the train's final destination direct routes
      // from origin. We *assume* that if one of those direct route IDs is one of
      // the target IDs then that ETD train must be that route and as such its
      // a train we want to use.
      // NOTE: If the ETD information just included the route ID, we wouldn't have to
      // do all of this reverse looking up. Also the direction returned for each train
      // estimate appears to not always be correct so we cannot rely on it.
      .filter((destinationEtdInfo) => {
        const { directRoutes: directRoutesForTrainDestination } = STATION_ROUTES_LOOKUP[origin][destinationEtdInfo.abbreviation]

        return directRoutesForTrainDestination.some((routeId) => targetRouteIds.has(routeId))
      })
      // for each set of ETDs for the destinations going in the route direction
      // add the destination info to the ETD info
      .map((destinationEtdInfo) =>
        destinationEtdInfo.estimate.map((estimateInfo) => ({
          ..._.omit(destinationEtdInfo, ['estimate']),
          ...estimateInfo,
          minutes: normalizeMinutes(estimateInfo.minutes),
        })),
      )
      // flatten out the groupings (now that each one has the destination info)
      .flatten()
      // filter down to the trains that will go all the way to the destination
      .filter((train: Train) => (
        _filterForTrainsThatGoAllTheWay(
          targetRouteIds,
          allowTransfers,
          train,
          destination,
        )
      ))
  )
}

type BackwardsTrainCollection = _.Collection<{
  backwardsTrain: Train;
  waitTime: number;
  backwardsRouteId: RouteId;
}>

const _getBackwardsTrains = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  targetRouteIds: Set<RouteId>,
): BackwardsTrainCollection => {
  const oppositeRouteIds = getOppositeRouteIds(origin, targetRouteIds)

  return (
    _genDestinationEtdsForStation(
      etdsLookup,
      origin,
      oppositeRouteIds,
    )
      .map((backwardsTrain) => ({
        backwardsTrain,
        waitTime: backwardsTrain.minutes,
        backwardsRouteId: getRouteIdsWithStartAndEnd(
          origin,
          backwardsTrain.abbreviation,
          backwardsTrain.hexcolor,
        )[0],
      }))
      // filter down to only the routes where a route ID was found
      .filter(({ backwardsRouteId }) => !!backwardsRouteId)
  )
}

const _minutesBetweenStation = (
  start: StationName,
  end: StationName,
  routeId: RouteId,
): number => {
  const { directRoutes, time } = STATION_ROUTES_LOOKUP[start][end]

  if (!directRoutes.includes(routeId)) {
    return 1000;
  }

  return time
}

type BackwardsTimeRoutePathsCollection = _.Collection<{
  backwardsTrain: Train;
  waitTime: number;
  backwardsRouteId: RouteId;
  backwardsStation: StationName;
  backwardsRideTime: number;
}>;

const _getBackwardsTimeRoutePaths = (
  _backwardsTrains: BackwardsTrainCollection,
  origin: StationName,
): BackwardsTimeRoutePathsCollection =>
  _backwardsTrains
    // for each backwards train, return a (nested) list of route paths
    // from origin to stations after origin (including time to get to that
    // station)
    .map(trainInfo => {
      const routeId = trainInfo.backwardsRouteId
      const routeForTrain = ROUTES_LOOKUP[routeId]
      const stationsForTrain = routeForTrain.stations

      return (
        _(stationsForTrain)
          // get all the stations after the origin
          .takeRightWhile((station) => station !== origin)
          // merge in the train information plus the time it takes from
          // origin to station (backwardsRideTime)
          .map((backwardsStation) => ({
            ...trainInfo,
            backwardsStation,
            backwardsRideTime: _minutesBetweenStation(origin, backwardsStation, routeId),
          }))
          // TODO: Remove for potential optimization?
          .value()
      )
    })
    // flatten out the nested list to get a list of backwards route paths
    // that include info on how long it takes to get to the backwards station
    .flatten()

type WaitTimesForBackwardsTimeRoutePathsCollection = _.Collection<{
  backwardsTrain: Train;
  waitTime: number;
  backwardsRouteId: RouteId;
  backwardsStation: StationName;
  backwardsRideTime: number;
  returnTrain: Train;
  backwardsWaitTime: number;
  returnRouteId: RouteId;
}>

/**
 * Given a list of backward route paths (with times), multiply that by the
 * possible return trains those route paths could wait for.
 */
const _getWaitTimesForBackwardsTimeRoutePaths = (
  _backwardsTimeRoutePaths: BackwardsTimeRoutePathsCollection,
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  targetRouteIds: Set<RouteId>,
  allowTransfers: boolean,
): WaitTimesForBackwardsTimeRoutePathsCollection =>
  // for each backwards train, calculate how long it'll take to get to the
  // backwards station (waitTime + backwardsRideTime), then find all of the
  // arrivals to that backwards station within targetRouteIds. Need to filter
  // down to only arrivals to the backwards station that are greater than
  // (waitTime + backwardsRideTime). The valid backwards train arrival time
  // (backwardsArrivalTime) minus (waitTime + backwardsRideTime) is backwardsWaitTime
  _backwardsTimeRoutePaths
    .map(trainInfo => {
      const { waitTime, backwardsRideTime, backwardsStation } = trainInfo
      const timeToBackwardsStation = waitTime + backwardsRideTime

      return (
        _genDestinationEtdsForStation(
          etdsLookup,
          backwardsStation,
          targetRouteIds,
          destination,
          allowTransfers,
        )
          // after getting all the returning trains on the target routes,
          // include the wait time at the backwards station (negative values
          // mean that there isn't enough time to make it)
          .map((returnTrain) => ({
            ...trainInfo,
            returnTrain,
            backwardsWaitTime: returnTrain.minutes - timeToBackwardsStation,
            returnRouteId: getRouteIdsWithStartAndEnd(
              backwardsStation,
              returnTrain.abbreviation,
              returnTrain.hexcolor,
            )[0],
          }))
          // filter down to the route paths where both the backwardsStation and origin
          // are on the return route
          .filter(
            ({ returnRouteId }) =>
              returnRouteId &&
              areStationsOnRouteStations(
                backwardsStation,
                origin,
                ROUTES_LOOKUP[returnRouteId].stations,
              ),
          )
          // TODO: Remove for potential optimization?
          .value()
      )
    })
    .flatten()

const _getSalmonTimeRoutePaths = (
  _backwardsTimeRoutePathsWithWaits: WaitTimesForBackwardsTimeRoutePathsCollection,
  origin: StationName,
): _.Collection<SalmonRoute> =>
  _backwardsTimeRoutePathsWithWaits
    // include the time it takes to get from the backwardsStation back to the origin
    // for every route path
    .map(trainInfo => ({
      ...trainInfo,
      returnRideTime: _minutesBetweenStation(
        trainInfo.backwardsStation,
        origin,
        trainInfo.returnRouteId,
      ),
    }))

const _getAllNextArrivalsFromEtds = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  allowTransfers: boolean = false,
) => {
  // 1. Determine the desired routes based on the origin/destination
  // (w/o making a "trip" API request)
  const targetRouteIds = getTargetRouteIds(origin, destination, allowTransfers)

  // console.log('targetRouteIds', targetRouteIds)

  return _genDestinationEtdsForStation(
    etdsLookup,
    origin,
    targetRouteIds,
    destination,
    allowTransfers,
  )
}

const _getAllSalmonRoutesFromEtds = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  allowTransfers: boolean = false,
): _.Collection<SalmonRoute> => {
  // 1. Determine the desired routes based on the origin/destination
  // (w/o making a "trip" API request)
  const targetRouteIds = getTargetRouteIds(origin, destination, allowTransfers)

  // console.log(targetRouteIds, allowTransfers)

  // 2. Generate a list of the trains heading in the OPPOSITE direction w/
  // their arrival times (waitTime)
  const _backwardsTrains = _getBackwardsTrains(
    etdsLookup,
    origin,
    targetRouteIds,
  )

  // console.log(_backwardsTrains.value())
  // console.log('backwardsTrainsSize', _backwardsTrains.size())

  // 3. For each train, determine the estimated time it would take to get to
  // each following station in its route (backwardsRideTime)
  const _backwardsTimeRoutePaths = _getBackwardsTimeRoutePaths(
    _backwardsTrains,
    origin,
  )

  // console.log(_backwardsTimeRoutePaths.value())
  // console.log('backwardsTimeRoutePathsSize', _backwardsTimeRoutePaths.size())

  // 4. For each train at each station, determine the estimated wait time until
  // targetRouteId arrives at that station (backwardsWaitTime)
  const _backwardsTimeRoutePathsWithWaits = _getWaitTimesForBackwardsTimeRoutePaths(
    _backwardsTimeRoutePaths,
    etdsLookup,
    origin,
    destination,
    targetRouteIds,
    allowTransfers,
  )

  // console.log(_backwardsTimeRoutePathsWithWaits.value())
  // console.log('backwardsTimeRoutePathsSize', _backwardsTimeRoutePathsWithWaits.size())

  // 5. For each train at each station after waiting, determine estimated time
  // it would take to return to the origin on target route (returnRideTime)

  const _salmonTimeRoutePaths = _getSalmonTimeRoutePaths(
    _backwardsTimeRoutePathsWithWaits,
    origin,
  )

  // console.log(_salmonTimeRoutePaths.value())
  // console.log('salmonTimeRoutePathsSize', _salmonTimeRoutePaths.size())

  return _salmonTimeRoutePaths
}

/*
 * Given a salmon route, returns the total time it takes to go back and return to
 * the origin
 */
export const getSalmonTimeFromRoute = ({
  waitTime,
  backwardsRideTime,
  backwardsWaitTime,
  returnRideTime,
}: SalmonRoute): number =>
  waitTime + backwardsRideTime + backwardsWaitTime + returnRideTime

/**
 * Given origin and destination stations, returns a list of available trains,
 * sorted by soonest to arrival
 */
export const getNextArrivalsFromEtds = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  numArrivals: number,
): Train[] => {
  // First try to get arrivals using only direct lines
  let _allArrivals = _getAllNextArrivalsFromEtds(
    etdsLookup,
    origin,
    destination,
  )


  // If no results, then get arrivals with routes that require a transfer
  if (_allArrivals.isEmpty()) {
    _allArrivals = _getAllNextArrivalsFromEtds(
      etdsLookup,
      origin,
      destination,
      true,
    )
  }

  return (
    _allArrivals
      .sortBy(['minutes'])
      // 9. Take the first numSuggestions suggestions
      .take(numArrivals)
      .value()
  )
}

/*
 * Given origin and destination stations, returns a list of suggested salmon routes
 */
export const getSuggestedSalmonRoutesFromEtds = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  numSuggestions: number = DEFAULT_NUM_SALMON_SUGGESTIONS,
  riskinessFactor: number = DEFAULT_MINIMUM_BACKWARDS_STATION_WAIT_TIME,
): SalmonRoute[] => {
  // First try to get salmon routes using only direct lines
  let _allSalmonRoutes = _getAllSalmonRoutesFromEtds(
    etdsLookup,
    origin,
    destination,
  )

  // If no results, then get salmon routes with routes that require a transfer
  if (_allSalmonRoutes.isEmpty()) {
    _allSalmonRoutes = _getAllSalmonRoutesFromEtds(
      etdsLookup,
      origin,
      destination,
      true,
    )
  }

  return (
    _allSalmonRoutes
      // 6. Only include the trains where the wait time at the backwards
      // station is greater that the minimum allowable to increase the
      // likelihood of making the train
      .filter(({ backwardsWaitTime }) => backwardsWaitTime >= riskinessFactor)
      // 7. Add up waitTime + backwardsRideTime + backwardsWaitTime + returnRideTime
      // (salmonTime) for each salmon route path and sort by ascending total time
      // NOTE: This can be made significantly complicated to determine which routes
      // have most priority
      .sortBy([
        // first sort by salmonTime
        (salmonRoute) => getSalmonTimeFromRoute(salmonRoute),
        // then by initial wait time (want to catch the soonest opposite train)
        ({ waitTime }) => waitTime,
        // then by total wait time (the lower the total wait the further backwards
        // it should travel)
        ({ waitTime, backwardsWaitTime }) => waitTime + backwardsWaitTime,
      ])
      // 8. filter out duplicate routes which are basically just progressively
      // getting off a station earlier
      .uniqBy((salmonRoute) => {
        const salmonTime = getSalmonTimeFromRoute(salmonRoute)
        const { waitTime, backwardsTrain: { abbreviation } } = salmonRoute

        // waitTime + train abbreviation uniquely identifies a train and then
        // we add in salmonTime so that if the same train comes later it could
        // still be viable
        return `${salmonTime}-${abbreviation}-${waitTime}`
      })
      // 9. Take the first numSuggestions suggestions
      .take(numSuggestions)
      .value()
  )
}
