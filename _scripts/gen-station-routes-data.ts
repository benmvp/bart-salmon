import zipObject from 'lodash/zipObject'
import mapValues from 'lodash/mapValues'
import keyBy from 'lodash/keyBy'
import { fetchBartInfo } from '../src/api/bart'
import { DepartureApiRequest, ApiDepartureResponse } from '../src/api/types'
import { genDataFile } from './utils'
import { StationName, StationLookup, RouteId } from '../src/utils/types'
import stationsLookup from '../src/data/stations.json'


const STATION_NAMES = Object.keys(
  (stationsLookup as unknown) as StationLookup
) as StationName[]

const NUM_FETCH_TRIES = 5

const _fetchDepartSchedules = (
  orig: StationName,
  dest: StationName,
  time: string
) =>
  fetchBartInfo<DepartureApiRequest>({
    type: 'sched',
    command: 'depart',
    params: { orig, dest, time, date: '08/01/2019' }
  })

const _getDepartSchedules = async (
  origin: StationName,
  destination: StationName,
  time: string
): Promise<ApiDepartureResponse> => {
  let numTries = 0
  let lastError = null

  while (numTries < NUM_FETCH_TRIES) {
    try {
      return await _fetchDepartSchedules(
        origin,
        destination,
        time
      )
    } catch (err) {
      lastError = err
      // try again just in case there was some transient issue
      numTries++
    }
  }

  throw lastError
}

const _itemsOrNull = <T>(items: T[]) => (
  items.length > 0 ? items : undefined
)

const _getRoutesForOriginDestination = async (
  origin: StationName,
  destination: StationName,
) => {
  const departSchedulesEvening = await _getDepartSchedules(
    origin,
    destination,
    '5:00pm'
  )
  const departSchedulesLateNight = await _getDepartSchedules(
    origin,
    destination,
    '11:00pm'
  )

  const trips = [
    ...departSchedulesEvening.schedule.request.trip,
    ...departSchedulesLateNight.schedule.request.trip,
  ]
  const directRoutes = [
    ...new Set(
      trips
        .filter((tripInfo) => tripInfo.leg.length === 1)
        .map((tripInfo) => tripInfo.leg[0]['@line'])
    ),
  ]
  let multiRoutes = [
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

/*
 * For the given origin station, returns a promise that when fulfilled returns a
 * lookup of destination stations to direct and multi routes
 */
const _getAllDestinationRoutesForStation = async (origin: StationName) => {
  const getAllDestinationRoutesForStation = STATION_NAMES
    // exclude the same station since there's no where to travel
    .filter((station) => station !== origin)
    // build a sequence of promises that'll get direct and multi routes info
    // for each origin-destination combination
    .map((destination) => _getRoutesForOriginDestination(origin, destination))
  const allDestinationRoutesForStationList = await Promise.all(
    getAllDestinationRoutesForStation
  )
  const allDestinationRoutesForStationLookup = keyBy(
    allDestinationRoutesForStationList,
    'destination',
  )

  return mapValues(
    allDestinationRoutesForStationLookup,
    ({ directRoutes, multiRoutes }) => ({ directRoutes, multiRoutes })
  )
}

/*
 * Return a promise that when fulfilled contains a lookup of origin stations to
 * destination stations to direct and multi routes
 */
const _getStationRoutes = async () => {
  const getStationRoutes = STATION_NAMES.map(_getAllDestinationRoutesForStation)
  const stationRoutesList = await Promise.all(getStationRoutes)

  return zipObject(STATION_NAMES, stationRoutesList)
}

genDataFile(
  _getStationRoutes,
  '../src/data/station-routes.json',
  'routes between stations'
)
