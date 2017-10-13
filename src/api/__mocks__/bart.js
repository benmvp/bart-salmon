// @flow
import values from 'lodash/values'
import etds from './etds-rush-pm.json'

const BART_INFO = {
  etd: {
    etd: values(etds),
  },
}

const fetchBartInfo = (type: string, command: string): Promise<Object> =>
  new Promise(resolve => {
    setTimeout(resolve.bind(null, BART_INFO[type][command]), 0)
  })

export default fetchBartInfo
