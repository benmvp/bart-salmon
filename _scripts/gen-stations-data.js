// @flow
import _ from 'lodash'
import {fetchJson} from '../app/api/fetch'
import {genDataFile} from './utils'
import {forceArray} from '../app/utils/general'

const _normalizeArrayResponse = (arrayResponse:Object, itemName:string):mixed => (
    arrayResponse ? forceArray(arrayResponse[itemName]) : []
)

const _normalizeRoutes = (routesJson) => _normalizeArrayResponse(routesJson, 'route')

const _normalizePlatforms = (platformsJson) => _normalizeArrayResponse(platformsJson, 'platform')

const _normalizeStation = (stationInfo) => ({
    ...stationInfo,
    northRoutes: _normalizeRoutes(stationInfo.northRoutes),
    southRoutes: _normalizeRoutes(stationInfo.southRoutes),
    northPlatforms: _normalizePlatforms(stationInfo.northPlatforms),
    southPlatforms: _normalizePlatforms(stationInfo.southPlatforms)
})

const _getStations = (): Promise<Object> => (
    fetchJson('stn', 'stns')
        .then((respJson) => (
            Promise.all(
                respJson.stations.station.map(({abbr}) => (
                    fetchJson('stn', 'stninfo', {orig: abbr})
                ))
            )
        ))
        .then((respStations) => (
            respStations.map((respStation) => (
                _normalizeStation(respStation.stations.station)
            ))
        ))
        .then((stations) => _.keyBy(stations, 'abbr'))
)

genDataFile(_getStations, '../app/data/stations.json', 'stations')
