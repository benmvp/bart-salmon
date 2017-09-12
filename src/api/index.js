// @flow

import keyBy from 'lodash/keyBy'
import fetchBartInfo from './bart'

// import etds from './__mocks__/etds-rush-pm.json'

export const getEstimatedTimesOfDeparture = (): Promise<{[id:string]: Object}> => (
    fetchBartInfo('etd', 'etd', {orig: 'ALL'})
        .then((respJson) => keyBy(respJson.station, 'abbr'))
)

// export const getEstimatedTimesOfDeparture = (): Promise<{[id:string]: Object}> => (
//     Promise.resolve(etds)
// )
