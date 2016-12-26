// @flow
import {join} from 'path'
import {writeFile} from './fsUtils'

type GetDataFunction = () => Promise<Object>

export const genDataFile = async (func:GetDataFunction, path:string, description:string):Promise<*> => {
    try {
        console.log(`Writing ${description} data...`)

        let fullPath = join(__dirname, path)
        let dataJson = JSON.stringify(
            await func(),
            null,
            '  '
        )

        await writeFile(fullPath, dataJson)

        console.log(`\tDONE! (${fullPath})`)
    } catch(ex) {
        console.error(ex)
    }
}
