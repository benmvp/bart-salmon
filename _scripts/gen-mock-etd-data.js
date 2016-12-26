// @flow
import {genDataFile} from './utils'
import {getEstimatedDepartureTimes} from '../app/api'

genDataFile(getEstimatedDepartureTimes, '../_mockData/etds.json', 'estimated times of departure')
