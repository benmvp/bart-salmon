// import keyBy from 'lodash/keyBy'
// import { fetchBartInfo } from './bart'
// import { EtdsApiRequest } from './types'
// import { EtdsLookup } from '../utils/types'


// export const getEstimatedTimesOfDeparture = (): Promise<EtdsLookup> =>
//   fetchBartInfo<EtdsApiRequest>({
//     type: 'etd',
//     command: 'etd',
//     params: { orig: 'ALL' }
//   }).then((respJson) => keyBy(respJson.station, 'abbr'))

import { EtdsLookup } from '../utils/types'
import etds from './__mocks__/etds-rush-pm-off-by-one.json'

export const getEstimatedTimesOfDeparture = (): Promise<EtdsLookup> => Promise.resolve(
  (etds as unknown) as EtdsLookup
)
