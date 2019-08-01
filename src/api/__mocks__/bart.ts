import values from 'lodash/values'
import { EtdsLookup } from '../../utils/types'
import { ApiRequest, ApiResponse, EtdsApiRequest } from '../types'
import etds from './etds-rush-pm.json'


const MOCK_ETDS_RESPONSE = {
  uri: '',
  date: '',
  time: '',
  station: values((etds as unknown) as EtdsLookup),
} as ApiResponse<EtdsApiRequest>

export const fetchBartInfo = async <Request extends ApiRequest>(
  apiRequest: Request,
): Promise<ApiResponse<Request>> => (
    new Promise((resolve) => {
      let info

      if (apiRequest.type === 'etd' && apiRequest.command === 'etd') {
        info = MOCK_ETDS_RESPONSE as ApiResponse<Request>
      }

      setTimeout(resolve.bind(null, info), 0)
    })
  )
