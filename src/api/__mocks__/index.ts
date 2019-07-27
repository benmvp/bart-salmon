import {EtdsLookup} from '../../utils/types'
import etds from './etds-rush-pm.json'

export const getEstimatedTimesOfDeparture = (): Promise<EtdsLookup> =>
  new Promise(resolve => {
    setTimeout(resolve.bind(null, (etds as unknown) as EtdsLookup), 0)
  })
