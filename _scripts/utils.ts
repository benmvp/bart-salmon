import { join } from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'

import 'isomorphic-fetch'

const writeFileAsync = promisify(writeFile)

export const genDataFile = async (
  getData: () => Promise<{}>,
  path: string,
  description: string
) => {
  try {
    console.log(`Writing ${description} data...`)

    const fullPath = join(__dirname, path)
    const dataJson = JSON.stringify(
      await getData(),
      null,
      '  '
    )

    await writeFileAsync(fullPath, dataJson)

    console.log(`\tDONE! (${fullPath})`)
  } catch (ex) {
    console.error(ex)
  }
}
