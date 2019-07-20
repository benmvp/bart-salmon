import {camelize} from 'humps'
import {formatUrl} from 'url-lib'
import {parseString} from 'xml2js'
import {parseNumbers} from 'xml2js/lib/processors'
import {fetchText} from './fetch'
import {ApiRequest, ParsedXmlRootResponse} from './types'


type ParsedXmlResponse = {
  root: ParsedXmlRootResponse;
}


const API_BASE = 'http://api.bart.gov/api/'

const _parseXml = (xmlString: string): Promise<ParsedXmlResponse> =>
  new Promise((resolve, reject) => {
    parseString(
      xmlString,
      {
        explicitArray: false,
        trim: true,
        normalize: true,
        mergeAttrs: true,
        tagNameProcessors: [camelize],
        attrNameProcessors: [camelize],
        valueProcessors: [parseNumbers],
        attrValueProcessors: [parseNumbers],
      },
      (err: Error, result: ParsedXmlResponse) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      },
    )
  })

const fetchBartInfo = (apiRequest: ApiRequest): Promise<ParsedXmlRootResponse> => {
  const url = formatUrl(`${API_BASE}${apiRequest.type}.aspx`, [
    {
      cmd: apiRequest.command,
      key: 'MW9S-E7SL-26DU-VV8V',
    },
    apiRequest.params,
  ])

  return fetchText(url)
    .then(_parseXml)
    .then(xmlAsJS => xmlAsJS.root)
}

export default fetchBartInfo
