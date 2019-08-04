import zipObject from 'lodash/zipObject'
import mapValues from 'lodash/mapValues'
import keyBy from 'lodash/keyBy'
import { fetchBartInfo } from '../src/api/bart'
import { DepartureApiRequest } from '../src/api/types'
import { genDataFile, processSequentially } from './utils'
import { StationName, StationLookup, RouteId } from '../src/utils/types'
import stationsLookup from '../src/data/stations.json'


const STATION_NAMES = Object.keys(
  (stationsLookup as unknown) as StationLookup
) as StationName[]

const _fetchDepartSchedules = (
  orig: StationName,
  dest: StationName,
  time: string
) =>
  fetchBartInfo<DepartureApiRequest>({
    type: 'sched',
    command: 'depart',
    params: { orig, dest, time, date: '09/10/2019' }
  })

const _itemsOrNull = <T>(items: T[]) => (
  items.length > 0 ? items : undefined
)

const _getRoutesForOriginDestination = async (
  origin: StationName,
  destination: StationName,
) => {
  // Get the departure schedule at evening rush & late night to ensure
  // we get the normal routes plus the off-peak routes
  const [departSchedulesEvening, departSchedulesLateNight] = await Promise.all([
    _fetchDepartSchedules(origin, destination, '5:00pm'),
    _fetchDepartSchedules(origin, destination, '11:00pm'),
  ])

  // Merge the trip information from both times
  const trips = [
    ...departSchedulesEvening.schedule.request.trip,
    ...departSchedulesLateNight.schedule.request.trip,
  ]

  // Get the unique route IDs for trips that only needed one leg
  // (i.e. direct routes)
  const directRoutes = [
    ...new Set(
      trips
        .filter((tripInfo) => tripInfo.leg.length === 1)
        .map((tripInfo) => tripInfo.leg[0]['@line'])
    ),
  ]

  // Get the unique tuples of route IDs that are needed for multi-leg trips
  const multiRoutes = [
    ...new Set(
      trips
        .filter((tripInfo) => tripInfo.leg.length > 1)
        .map((tripInfo) => tripInfo.leg.map((leg) => leg['@line']))
        .map((tripRoutes) => tripRoutes.join('|'))
    )
  ]
    .map((tripRouteString) => tripRouteString.split('|') as RouteId[])

  return {
    destination,
    directRoutes: _itemsOrNull(directRoutes),
    multiRoutes: _itemsOrNull(multiRoutes)
  }
}

/**
 * For the given origin station, returns a promise that when fulfilled returns a
 * lookup of destination stations to direct and multi routes
 */
const _getAllDestinationRoutesForStation = async (origin: StationName) => {
  // Build up a list of destination stations by removing the
  // origin station
  const destinationStations = STATION_NAMES.filter((station) => station !== origin)

  // Get the destination routes for all the destination stations.
  const destinationRoutes = await processSequentially(
    destinationStations,
    (destination) => _getRoutesForOriginDestination(origin, destination),
    10,
  )

  // Convert the routes list into a look up by the destination
  const destinationRoutesLookup = keyBy(destinationRoutes, 'destination')

  // Only keep `directRoutes` & `multiRoutes` in the look up (removing `destination`
  // that was used to create the lookup)
  return mapValues(
    destinationRoutesLookup,
    ({ directRoutes, multiRoutes }) => ({ directRoutes, multiRoutes })
  )
}

/**
 * Return a promise that when fulfilled contains a lookup of origin stations to
 * destination stations to direct and multi routes
 */
const _getStationRoutes = async () => {
  const stationRoutesList = await processSequentially(
    STATION_NAMES,
    _getAllDestinationRoutesForStation,
  )

  return zipObject(STATION_NAMES, stationRoutesList)
}

genDataFile(
  _getStationRoutes,
  '../src/data/station-routes.json',
  'routes between stations'
)
