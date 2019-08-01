import { formatUrl } from 'url-lib'
import { camelizeKeys } from 'humps'
import { fetchJson } from './fetch'
import { ApiRequest, ApiResponse } from './types'


const API_BASE = 'http://api.bart.gov/api/'

export const fetchBartInfo = async <Request extends ApiRequest>(
  apiRequest: Request,
): Promise<ApiResponse<Request>> => {
  const url = formatUrl(`${API_BASE}${apiRequest.type}.aspx`, [
    {
      cmd: apiRequest.command,
      key: 'MW9S-E7SL-26DU-VV8V',
      json: 'y',
    },
    apiRequest.params,
  ])
  const resp = await fetchJson(url)

  return camelizeKeys(resp.root) as ApiResponse<Request>
}
