import keyBy from 'lodash/keyBy'
import { fetchBartInfo } from './bart'
import { EtdsLookup } from '../utils/types'
import { EtdsApiRequest } from './types'
// import etds from './__mocks__/etds-rush-pm.json'


export const getEstimatedTimesOfDeparture = (): Promise<EtdsLookup> =>
  fetchBartInfo<EtdsApiRequest>({
    type: 'etd',
    command: 'etd',
    params: { orig: 'ALL' }
  }).then((respJson) => {
    console.log(respJson.station)
    return keyBy(respJson.station, 'abbr')
  })

// export const getEstimatedTimesOfDeparture = (): Promise<EtdsLookup> => Promise.resolve(
//   (etds as unknown) as EtdsLookup
// )
