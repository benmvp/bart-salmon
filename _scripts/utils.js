// @flow
import {join} from 'path'
import {writeFile} from './fsUtils'

type GetDataFunction = () => Promise<Object>

export const genDataFile = async (func:GetDataFunction, path:string, description:string):Promise<*> => {
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
