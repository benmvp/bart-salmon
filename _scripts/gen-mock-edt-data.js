// @flow
import {genDataFile} from './utils'
import {getEstimatedDepartureTimes} from '../app/api'

genDataFile(getEstimatedDepartureTimes, '../_mockData/edts.json', 'estimated departure times')
