import {join} from 'path'
import {writeFile} from './fsUtils'
import {getEstimatedDepartureTimes} from '../app/api'

const _writeEstimatedDepartureTimes = async (station = undefined) => {
    try {
        let estimatedDepartureTimesJSON = JSON.stringify(
            await getEstimatedDepartureTimes(station),
            null,
            '  '
        )

        await writeFile(
            join(__dirname, '../_mockData/etds.json'),
            estimatedDepartureTimesJSON
        )
    } catch(ex) {
        console.error(ex)
    }
}

console.log('Writing estimated departure times...')
_writeEstimatedDepartureTimes()
console.log('\tDONE!')
