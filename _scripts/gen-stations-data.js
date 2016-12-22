import {genDataFile} from './utils'
import {getStations} from '../app/api'

genDataFile(getStations, '../app/data/stations.json', 'stations')
