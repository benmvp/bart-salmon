// @flow

import {formatUrl} from 'url-lib'
import {parseString} from 'xml2js'
import keyBy from 'lodash/keyBy'

import 'isomorphic-fetch'

const _API_BASE = 'http://api.bart.gov/api/'

const _parseXml = (xmlString) => (
    new Promise((resolve, reject) => {
        parseString(xmlString, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
)

const _fetchJson = (type, command, params) => {
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

    console.log(url)

    return fetch(url)
        .then((resp) => resp.text())
        .then(_parseXml)
        .then((xmlAsJS) => xmlAsJS.root)
}

export const getEstimatedDepartureTimes = (station = 'ALL') => (
    _fetchJson('etd', 'etd', {orig: station})
        .then((respJson) => keyBy(respJson.station, 'abbr'))
)
