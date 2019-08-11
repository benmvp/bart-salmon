import { genDataFile } from './utils'
import { getEstimatedTimesOfDeparture } from '../src/api'

(async () => {
    try {
        const [, , mockFileName = 'etds'] = process.argv

        await genDataFile(
            getEstimatedTimesOfDeparture,
            `../src/api/__mocks__/${mockFileName}.json`,
            'estimated times of departure'
        )
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()
