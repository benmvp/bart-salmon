import zipObject from 'lodash/zipObject'
import mapValues from 'lodash/mapValues'
import keyBy from 'lodash/keyBy'
import sum from 'lodash/sum'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import addDays from 'date-fns/add_days'
import formatDate from 'date-fns/format'
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
  date: Date,
) =>
  fetchBartInfo<DepartureApiRequest>({
    type: 'sched',
    command: 'depart',
    params: {
      orig,
      dest,
      date: formatDate(date, 'MM/DD/YYYY'),
      time: '5:00pm',
    }
  })

const _getRoutesForOriginDestination = async (
  origin: StationName,
  destination: StationName,
) => {
  const nextWeek = addDays(Date.now(), 7)
  const sunday = startOfWeek(nextWeek)
  const saturday = endOfWeek(nextWeek)
  const wednesday = addDays(sunday, 3)

  // Get the departure schedule on different days to ensure
  // we get the normal routes plus the off-peak routes
  const allDepartureSchedules = await Promise.all([
    _fetchDepartSchedules(origin, destination, wednesday),
    _fetchDepartSchedules(origin, destination, saturday),
    _fetchDepartSchedules(origin, destination, sunday),
  ])

  // Merge the trip information from all schedules
  const trips = allDepartureSchedules
    .map((schedules) => schedules.schedule.request.trip)
    .flat()

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

  // get the average time between the two stations
  const time = Math.ceil(
    sum(trips.map((tripInfo) => +tripInfo['@tripTime'])) / trips.length
  )

  return {
    destination,
    directRoutes,
    multiRoutes,
    time,
  }
}

/**
 * For the given origin station, returns a promise that when fulfilled returns a
 * lookup of destination stations to direct and multi routes
 */
const _getAllDestinationRoutesForStation = async (origin: StationName) => {
  console.log(`Fetching destination route info for: ${origin}`)

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
    ({ directRoutes, multiRoutes, time }) => ({ directRoutes, multiRoutes, time })
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

(async () => {
  try {
    await genDataFile(
      _getStationRoutes,
      '../src/data/station-routes.json',
      'routes between stations'
    )
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
