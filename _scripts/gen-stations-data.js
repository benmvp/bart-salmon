import {join} from 'path'
import {writeFile} from './fsUtils'
import {normalizeArrayResponse, getStations} from '../app/api'

(async () => {
    try {
        console.log('Writing stations data...')

        let stationsLookupJson = JSON.stringify(
            await getStations(),
            null,
            '  '
        )

        await writeFile(
            join(__dirname, '../app/data/stations.json'),
            stationsLookupJson
        )

        console.log('\tDONE!')
    } catch(ex) {
        console.error(ex)
    }
}) ()
