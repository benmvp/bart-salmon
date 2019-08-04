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
    console.log(`Retrieving ${description} data...`)

    const data = await getData()
    const fullPath = join(__dirname, path)
    const dataJson = JSON.stringify(data, null, 2)

    console.log(`Writing ${description} data...`)

    await writeFileAsync(fullPath, dataJson)

    console.log(`\tDONE! (${fullPath})`)
  } catch (ex) {
    console.error(ex)
  }
}

/**
 * Processes each item in `inputList` with the potentially asynchronous `processFn`, returning a Promise that will resolve with an array of the output items
 * @param inputList - A list of input items to process
 * @param processFn - A potentially asynchronous function that processes an input item, returning an output item (or a Promise that resolves to an output item)
 * @param chunkSize - The number of items to process simultaneously to speed up processing
 * @returns A Promise that resolves to an array of output items
 */
export const processSequentially = async <Input, Output>(
  inputList: Input[],
  processFn: (item: Input) => Output | PromiseLike<Output>,
  chunkSize = 1,
): Promise<Output[]> => {
  let outputList: Output[] = []

  for (let i = 0; i < inputList.length; i += chunkSize) {
    const chunk = inputList.slice(i, i + chunkSize)
    const processedChunk = await Promise.all(chunk.map(processFn))

    outputList.push(...processedChunk)
  }

  return outputList
}
