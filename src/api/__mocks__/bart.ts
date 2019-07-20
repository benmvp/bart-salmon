import values from 'lodash/values'
import {ApiRequest, ParsedXmlRootResponse, ParsedXmlEtdResponse} from '../types'
import etds from './etds-rush-pm.json'

const MOCK_ETDS_RESPONSE = {
  uri: '',
  date: '',
  time: '',
  station: values(etds),
} as ParsedXmlEtdResponse

const fetchBartInfo = (apiRequest: ApiRequest): Promise<ParsedXmlRootResponse> =>
  new Promise(resolve => {
    let info

    if (apiRequest.type === 'etd' && apiRequest.command === 'etd') {
      info = MOCK_ETDS_RESPONSE
    }

    setTimeout(resolve.bind(null, info), 0)
  })

export default fetchBartInfo
