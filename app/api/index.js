// @flow

import _ from 'lodash'
import {fetchJson} from './fetch'

export const getEstimatedTimesOfDeparture = (): Promise<{[id:string]: Object}> => (
    fetchJson('etd', 'etd', {orig: 'ALL'})
        .then((respJson) => _.keyBy(respJson.station, 'abbr'))
)
