// @flow
import {genDataFile} from './utils'
import {getEstimatedTimesOfDeparture} from '../app/api'

genDataFile(getEstimatedTimesOfDeparture, '../app/api/__mocks__/etds.json', 'estimated times of departure')
