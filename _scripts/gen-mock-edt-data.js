import {join} from 'path'
import {writeFile} from './fsUtils'
import {getEstimatedDepartureTimes} from '../app/api'

(async (station = undefined) => {
    try {
        console.log('Writing estimated departure times...')

        let estimatedDepartureTimesJSON = JSON.stringify(
            await getEstimatedDepartureTimes(station),
            null,
            '  '
        )

        await writeFile(
            join(__dirname, '../_mockData/edts.json'),
            estimatedDepartureTimesJSON
        )

        console.log('\tDONE!')
    } catch(ex) {
        console.error(ex)
    }
}) ()
