// @flow
import {camelize} from 'humps'
import {formatUrl} from 'url-lib'
import {parseString} from 'xml2js'
import {parseNumbers} from 'xml2js/lib/processors'

const API_BASE = 'http://api.bart.gov/api/'

const _parseXml = (xmlString: string): Promise<Object> => (
    new Promise((resolve, reject) => {
        parseString(
            xmlString,
            {
                explicitArray: false,
                trim: true,
                normalize: true,
                mergeAttributes: true,
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

export const fetchJson = (type: string, command: string, params: ?Object = undefined): Promise<Object> => {
    let url = formatUrl(
        `${API_BASE}${type}.aspx`,
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
