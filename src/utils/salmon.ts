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
  getMinutesBetweenStation,
  trainsThatGoAllTheWayFilter,
  areTrainsSimilar,
} from './routes'
import routesLookup from '../data/routes.json'
import stationRoutesLookup from '../data/station-routes.json'

const ROUTES_LOOKUP = (routesLookup as unknown) as RoutesLookup
const STATION_ROUTES_LOOKUP = (stationRoutesLookup as unknown) as StationRoutesLookup

// minimum number of minutes to wait at the backwards station
// the higher this number is the more likely to make the train
const DEFAULT_MINIMUM_BACKWARDS_STATION_WAIT_TIME = 1


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
): _.Collection<Train> => {
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
        // Sometimes ETD information for an endpoint station, still has estimates for
        // trains going to itself, so we need to exclude those
        if (origin === destinationEtdInfo.abbreviation) {
          return false
        }
        const { directRoutes: directRoutesForTrainDestination } = STATION_ROUTES_LOOKUP[origin][destinationEtdInfo.abbreviation]

        return directRoutesForTrainDestination.some((routeId) => targetRouteIds.has(routeId))
      })
      // for each set of ETDs for the destinations going in the route direction
      // add the destination info to the ETD info
      .map((destinationEtdInfo): Train[] =>
        destinationEtdInfo.estimate.map((estimateInfo) => ({
          ..._.omit(destinationEtdInfo, ['estimate']),
          ...estimateInfo,
          minutes: normalizeMinutes(estimateInfo.minutes),
          routeId: getRouteIdsWithStartAndEnd(
            origin,
            destinationEtdInfo.abbreviation,
            estimateInfo.hexcolor,
          )[0]
        })),
      )
      // flatten out the groupings (now that each one has the destination info)
      .flatten()
      // filter down to the trains that will go all the way to the destination
      .filter((train: Train) => (
        trainsThatGoAllTheWayFilter(
          targetRouteIds,
          allowTransfers,
          train,
          destination,
        )
      ))

  )
}

interface BackwardsTrainInfo {
  backwardsTrain: Train;
  waitTime: number;
  backwardsRouteId: RouteId;
}

const _getBackwardsTrains = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  targetRouteIds: Set<RouteId>,
): _.Collection<BackwardsTrainInfo> => {
  const oppositeRouteIds = getOppositeRouteIds(origin, targetRouteIds)

  return (
    _genDestinationEtdsForStation(
      etdsLookup,
      origin,
      oppositeRouteIds,
    )
      .map((backwardsTrain): BackwardsTrainInfo => ({
        backwardsTrain,
        waitTime: backwardsTrain.minutes,
        backwardsRouteId: backwardsTrain.routeId,
      }))
      // filter down to only the routes where a route ID was found
      .filter(({ backwardsRouteId }) => !!backwardsRouteId)
  )
}


interface BackwardsTimeRoutePathInfo extends BackwardsTrainInfo {
  backwardsStation: StationName;
  backwardsRideTime: number;
}

const _getBackwardsTimeRoutePaths = (
  _backwardsTrains: _.Collection<BackwardsTrainInfo>,
  origin: StationName,
): _.Collection<BackwardsTimeRoutePathInfo> =>
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
            backwardsRideTime: getMinutesBetweenStation(origin, backwardsStation, routeId),
          }))
          // TODO: Remove for potential optimization?
          .value()
      )
    })
    // flatten out the nested list to get a list of backwards route paths
    // that include info on how long it takes to get to the backwards station
    .flatten()

interface WaitTimesForBackwardsTimeRoutePathInfo extends BackwardsTimeRoutePathInfo {
  returnTrain: Train;
  backwardsWaitTime: number;
  returnRouteId: RouteId;
}

/**
 * Given a list of backward route paths (with times), multiply that by the
 * possible return trains those route paths could wait for.
 */
const _getWaitTimesForBackwardsTimeRoutePaths = (
  _backwardsTimeRoutePaths: _.Collection<BackwardsTimeRoutePathInfo>,
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  targetRouteIds: Set<RouteId>,
  allowTransfers: boolean,
): _.Collection<WaitTimesForBackwardsTimeRoutePathInfo> => {
  // for each backwards train, calculate how long it'll take to get to the
  // backwards station (waitTime + backwardsRideTime), then find all of the
  // arrivals to that backwards station within targetRouteIds. Need to filter
  // down to only arrivals to the backwards station that are greater than
  // (waitTime + backwardsRideTime). The valid backwards train arrival time
  // (backwardsArrivalTime) minus (waitTime + backwardsRideTime) is backwardsWaitTime
  return _backwardsTimeRoutePaths
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
            returnRouteId: returnTrain.routeId,
            backwardsWaitTime: returnTrain.minutes - timeToBackwardsStation,
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
}

/**
 * Include the time it takes to get from the backwardsStation back to the origin
 * for every route path
 */
const _getSalmonTimeRoutePaths = (
  _backwardsTimeRoutePathsWithWaits: _.Collection<WaitTimesForBackwardsTimeRoutePathInfo>,
  origin: StationName,
): _.Collection<SalmonRoute> =>
  _backwardsTimeRoutePathsWithWaits
    .map(trainInfo => ({
      ...trainInfo,
      returnRideTime: getMinutesBetweenStation(
        trainInfo.backwardsStation,
        origin,
        trainInfo.returnRouteId,
      ),
    }))

/**
 * Adjust the backwardsWaitTime so that the new salmonTime will be equal to the
 * arrival times at the origin station.
 */
const _adjustSalmonRoutes = (
  _salmonTimeRoutePaths: _.Collection<SalmonRoute>,
  originArrivalTrains: Train[],
): _.Collection<SalmonRoute> => {
  return _salmonTimeRoutePaths
    .map((salmonRoute) => {
      // There are situations where the total salmonTime is more than the ETD says it'll take
      // the train to arrive. This would result in a salmon route taking 1 extra minute when
      // it'll really catch the same train. This is because the ETD values differ from the
      // pre-calculated time it takes between stations. So the fix is to adjust the backwardsWaitTime
      // by the difference so that every thing adds up correctly.
      const salmonTime = getSalmonTimeFromRoute(salmonRoute)
      const correspondingArrivalTrain = _.findLast(originArrivalTrains, (arrivalTrain) => (
        areTrainsSimilar(arrivalTrain, salmonRoute.returnTrain, salmonTime)
      ))
      let { backwardsWaitTime } = salmonRoute

      if (correspondingArrivalTrain) {
        backwardsWaitTime -= salmonTime - correspondingArrivalTrain.minutes
      }

      return {
        ...salmonRoute,
        backwardsWaitTime,
      }
    })
}

const _getAllNextArrivalsFromEtds = (
  etdsLookup: EtdsLookup,
  origin: StationName,
  destination: StationName,
  allowTransfers: boolean = false,
) => {
  // Determine the desired routes based on the origin/destination
  // (w/o making a "trip" API request)
  const targetRouteIds = getTargetRouteIds(origin, destination, allowTransfers)

  // console.log({targetRouteIds})

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
  // Determine the desired routes based on the origin/destination
  // (w/o making a "trip" API request)
  const targetRouteIds = getTargetRouteIds(origin, destination, allowTransfers)

  const originArrivalTrains = getNextArrivalsFromEtds(etdsLookup, origin, destination)

  // console.log({ targetRouteIds, originArrivalTrains, allowTransfers })

  // Generate a list of the trains heading in the OPPOSITE direction w/
  // their arrival times (waitTime)
  const _backwardsTrains = _getBackwardsTrains(
    etdsLookup,
    origin,
    targetRouteIds,
  )

  // console.log('backwardsTrains', _backwardsTrains.value())
  // console.log('backwardsTrainsSize', _backwardsTrains.size())

  // For each train, determine the estimated time it would take to get to
  // each following station in its route (backwardsRideTime)
  const _backwardsTimeRoutePaths = _getBackwardsTimeRoutePaths(
    _backwardsTrains,
    origin,
  )

  // console.log('backwardsTimeRoutePaths', _backwardsTimeRoutePaths.value())
  // console.log('backwardsTimeRoutePathsSize', _backwardsTimeRoutePaths.size())

  // For each train at each station, determine the estimated wait time until
  // targetRouteId arrives at that station (backwardsWaitTime)
  const _backwardsTimeRoutePathsWithWaits = _getWaitTimesForBackwardsTimeRoutePaths(
    _backwardsTimeRoutePaths,
    etdsLookup,
    origin,
    destination,
    targetRouteIds,
    allowTransfers,
  )

  // console.log('backwardsTimeRoutePathsWithWaits', _backwardsTimeRoutePathsWithWaits.value())
  // console.log('backwardsTimeRoutePathsWithWaitsSize', _backwardsTimeRoutePathsWithWaits.size())

  // For each train at each station after waiting, determine estimated time
  // it would take to return to the origin on target route (returnRideTime)

  const _salmonTimeRoutePaths = _getSalmonTimeRoutePaths(
    _backwardsTimeRoutePathsWithWaits,
    origin,
  )

  // console.log(_salmonTimeRoutePaths.value())
  // console.log('salmonTimeRoutePathsSize', _salmonTimeRoutePaths.size())

  const _adjustedSalmonRoutes = _adjustSalmonRoutes(
    _salmonTimeRoutePaths,
    originArrivalTrains,
  )

  // console.log(_adjustedSalmonRoutes.value())
  // console.log('adjustSalmonRoutesSize', _adjustedSalmonRoutes.size())

  return _adjustedSalmonRoutes
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
  numArrivals: number = Infinity,
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
      // Take the first numSuggestions suggestions
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
  riskinessFactor: number = DEFAULT_MINIMUM_BACKWARDS_STATION_WAIT_TIME,
  numSuggestions: number = Infinity,
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
      // Only include the trains where the wait time at the backwards
      // station is greater that the minimum allowable to increase the
      // likelihood of making the train
      .filter(({ backwardsWaitTime }) => backwardsWaitTime >= riskinessFactor)
      // Also filter out any routes where the salmonTime is NaN
      // (this happens when we cannot determine the minutes between to stations)
      .filter((salmonRoute) => !Number.isNaN(getSalmonTimeFromRoute(salmonRoute)))
      // Determine the priority of salmon routes by sorting by different times
      .sortBy([
        // first sort by salmonTime (obviously want the overall shortest routes)
        getSalmonTimeFromRoute,
        // then by total wait time (the lower the total wait the further backwards
        // it should travel)
        ({ waitTime, backwardsWaitTime }) => waitTime + backwardsWaitTime,
        // then by initial wait time (want to catch the soonest opposite train)
        'waitTime',
      ])
      // Filter out duplicate routes with the same salmon time because we basically
      // always want to leave out on the first backwards train so that we can go as 
      // far as possible with waiting as little as possible. A duplicate salmon time
      // means waiting longer for the backwards train and/or waiting longer for the
      // return train
      .uniqBy(getSalmonTimeFromRoute)
      // Filter out duplicate backwards stations as we want to get progressively
      // further recommendations. A duplicate backwards station indicates unnecessary
      // waiting
      .uniqBy('backwardsStation')
      // Take the first numSuggestions suggestions
      .take(numSuggestions)

      .value()
  )
}
