// @flow

import keyBy from 'lodash/keyBy'
import fetchBartInfo from './bart'

export const getEstimatedTimesOfDeparture = (): Promise<{[id:string]: Object}> => (
    fetchBartInfo('etd', 'etd', {orig: 'ALL'})
        .then((respJson) => keyBy(respJson.station, 'abbr'))
)
