import { genDataFile } from './utils'
import { getEstimatedTimesOfDeparture } from '../src/api'

const [, , mockFileName = 'etds'] = process.argv

genDataFile(
    getEstimatedTimesOfDeparture,
    `../src/api/__mocks__/${mockFileName}.json`,
    'estimated times of departure'
)
