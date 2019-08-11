import fs from 'fs'
import path from 'path'
import { fetchBartInfo } from './bart'

jest.mock('./fetch')

it('correctly transforms ETDs JSON response', async () => {
  require('./fetch').__setMockJson(
    fs.readFileSync(path.join(__dirname, './__mocks__/etd-raw.json')).toString(),
  )

  const etdResponse = await fetchBartInfo({ type: 'etd', command: 'etd' })

  expect(etdResponse).toMatchSnapshot()
})
