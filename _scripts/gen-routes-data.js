import {genDataFile} from './utils'
import {getRoutes} from '../app/api'

genDataFile(getRoutes, '../app/data/routes.json', 'routes')
