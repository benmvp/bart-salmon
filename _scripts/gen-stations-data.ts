import keyBy from 'lodash/keyBy'
import { fetchBartInfo } from '../src/api/bart'
import {
  ApiStationWithRoute,
  StationsApiRequest,
  StationInfoApiRequest,
} from '../src/api/types'
import { genDataFile, processSequentially } from './utils'
import { forceArray } from '../src/utils/general'
import { Station, RouteId } from '../src/utils/types'


const _normalizeRoutes = (routesJson?: { route: RouteId[] }): RouteId[] =>
  routesJson ? forceArray(routesJson.route) : []

const _normalizePlatforms = (platformsJson?: { platform: number[] }): number[] =>
  platformsJson ? forceArray(platformsJson.platform) : []


const _normalizeStation = (stationInfo: ApiStationWithRoute): Station => ({
  ...stationInfo,
  northRoutes: _normalizeRoutes(stationInfo.northRoutes),
  southRoutes: _normalizeRoutes(stationInfo.southRoutes),
  northPlatforms: _normalizePlatforms(stationInfo.northPlatforms),
  southPlatforms: _normalizePlatforms(stationInfo.southPlatforms)
})

const _getStations = async () => {
  const respStations = await fetchBartInfo<StationsApiRequest>({ type: 'stn', command: 'stns' })
  const stationInfos = await processSequentially(
    respStations.stations.station,
    ({ abbr }) => (
      fetchBartInfo<StationInfoApiRequest>({
        type: 'stn',
        command: 'stninfo',
        params: { orig: abbr },
      })
    ),
    10,
  )
  const stations = stationInfos.map((respStation) =>
    _normalizeStation(respStation.stations.station)
  )

  return keyBy(stations, 'abbr')
}

try {
  genDataFile(_getStations, '../src/data/stations.json', 'stations')
} catch (err) {
  console.error(err)
}
