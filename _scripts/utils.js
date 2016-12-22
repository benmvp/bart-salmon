import {join} from 'path'
import {writeFile} from './fsUtils'

export const genDataFile = async (func, path, description) => {
    try {
        console.log(`Writing ${description} data...`)

        let dataJson = JSON.stringify(
            await func(),
            null,
            '  '
        )

        await writeFile(join(__dirname, path), dataJson)

        console.log('\tDONE!')
    } catch(ex) {
        console.error(ex)
    }
}
