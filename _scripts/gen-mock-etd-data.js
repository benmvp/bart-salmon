// @flow
import {genDataFile} from './utils'
import {getEstimatedTimesOfDeparture} from '../src/api'

genDataFile(
    getEstimatedTimesOfDeparture,
    '../src/api/__mocks__/etds.json',
    'estimated times of departure'
)
