// @flow

import {camelizeKeys} from 'humps'
import {formatUrl} from 'url-lib'
import {parseString} from 'xml2js'
import keyBy from 'lodash/keyBy'
import omit from 'lodash/omit'
import {Route, Routes} from '../data/flowtypes'

import 'isomorphic-fetch'

const _API_BASE = 'http://api.bart.gov/api/'

const _parseXml = (xmlString) => (
    new Promise((resolve, reject) => {
        parseString(
            xmlString,
            {
                explicitArray: false,
                trim: true,
                normalize: true,
            },
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
    )
    })
)

const _fetchJson = (type:string, command:string, params:?Object = undefined):Promise<Object> => {
    let url = formatUrl(
        `${_API_BASE}${type}.aspx`,
        [
            {
                cmd: command,
                key: 'MW9S-E7SL-26DU-VV8V'
            },
            params
        ]
    )

    return fetch(url)
        .then((resp) => resp.text())
        .then(_parseXml)
        .then((xmlAsJS) => xmlAsJS.root)
}

const _forceArray = (value:mixed):any[] => (
    Array.isArray(value) ? value : [value]
)

const _normalizeArrayResponse = (arrayResponse:Object, itemName:string):mixed => (
    arrayResponse ? arrayResponse[itemName] : []
)

const _normalizeRoutes = (routesJson) => _forceArray(_normalizeArrayResponse(routesJson, 'route'))

const _normalizePlatforms = (platformsJson) => _forceArray(_normalizeArrayResponse(platformsJson, 'platform'))

const _normalizeStation = (stationInfo) => (
    camelizeKeys({
        ...stationInfo,
        northRoutes: _normalizeRoutes(stationInfo['north_routes']),
        southRoutes: _normalizeRoutes(stationInfo['south_routes']),
        northPlatforms: _normalizePlatforms(stationInfo['north_platforms']),
        southPlatforms: _normalizePlatforms(stationInfo['south_platforms'])
    })
)

const _normalizeRoute = (routeInfo:Object): Route => (
    camelizeKeys({
        ...omit(routeInfo, 'config', 'num_stns'),
        number: +routeInfo.number,
        holidays: !!+routeInfo.holidays,
        stations: routeInfo.config.station
    })
)

export const getEstimatedTimesOfDeparture = (): Promise<{[id:string]: Object}> => (
    _fetchJson('etd', 'etd', {orig: 'ALL'})
        .then((respJson) => (
            keyBy(
                camelizeKeys(_normalizeArrayResponse(respJson, 'station')),
                'abbr'
            )
        ))
)

export const getStations = (): Promise<Object> => (
    _fetchJson('stn', 'stns')
        .then((respJson) => (
            Promise.all(
                respJson.stations.station.map(({abbr}) => (
                    _fetchJson('stn', 'stninfo', {orig: abbr})
                ))
            )
        ))
        .then((respStations) => (
            respStations.map((respStation) => _normalizeStation(respStation.stations.station))
        ))
        .then((stations) => keyBy(stations, 'abbr'))
)

export const getRoutes = (): Promise<Routes> => (
    _fetchJson('route', 'routes')
        .then((respJson):Promise<Object[]> => (
            Promise.all(
                respJson.routes.route.map(({number}) => (
                    _fetchJson('route', 'routeinfo', {route: number})
                ))
            )
        ))
        .then((respRoutes:Object[]) => (
            respRoutes.map((respRoute:Object):Route => _normalizeRoute(respRoute.routes.route))
        ))
        .then((routes:Route[]) => keyBy(routes, 'routeID'))
)
