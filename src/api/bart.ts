import { formatUrl } from 'url-lib'
import { camelizeKeys } from 'humps'
import { fetchJson } from './fetch'
import { ApiRequest, ApiResponse } from './types'


const API_BASE = 'https://api.bart.gov/api/'

export const fetchBartInfo = async <Request extends ApiRequest>(
  apiRequest: Request,
  numRetries = 10,
  retryDelay = 100,
): Promise<ApiResponse<Request>> => {
  const url = formatUrl(`${API_BASE}${apiRequest.type}.aspx`, [
    {
      cmd: apiRequest.command,
      key: 'MW9S-E7SL-26DU-VV8V',
      json: 'y',
    },
    apiRequest.params,
  ])
  let tryNo = 0;
  let lastError;

  while (tryNo < numRetries) {
    try {
      const resp = await fetchJson(url)

      return camelizeKeys(resp.root) as ApiResponse<Request>
    } catch (err) {
      lastError = err
      // console.error(err)
      tryNo++

      if (retryDelay) {
        await new Promise((resolve) => {
          setTimeout(resolve, retryDelay);
        })
      }
    }
  }

  throw lastError
}
