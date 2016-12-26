// @flow

import _ from 'lodash'
import {camelize} from 'humps'
import {formatUrl} from 'url-lib'
import {parseString} from 'xml2js'
import {parseNumbers} from 'xml2js/lib/processors'
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
                tagNameProcessors: [camelize],
                attrNameProcessors: [camelize],
                valueProcessors: [parseNumbers],
                attrValueProcessors: [parseNumbers],
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
    arrayResponse ? _forceArray(arrayResponse[itemName]) : []
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

const _normalizeRoute = (routeInfo:Object): Route => (
    _(routeInfo)
        .omit(['config', 'numStns'])
        .merge({stations: routeInfo.config.station})
        .value()
)

export const getEstimatedTimesOfDeparture = (): Promise<{[id:string]: Object}> => (
    _fetchJson('etd', 'etd', {orig: 'ALL'})
        .then((respJson) => _.keyBy(respJson.station, 'abbr'))
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
        .then((stations) => _.keyBy(stations, 'abbr'))
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
        .then((routes:Route[]) => _.keyBy(routes, 'routeID'))
)
