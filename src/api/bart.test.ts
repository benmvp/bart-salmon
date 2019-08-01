import fs from 'fs'
import path from 'path'
import { fetchBartInfo } from './bart'

jest.mock('./fetch')

it('correctly converts ETDs XML to JS', async () => {
  require('./fetch').__setMockJson(
    fs.readFileSync(path.join(__dirname, './__mocks__/etd-etd.xml')).toJSON(),
  )

  const etdResponse = await fetchBartInfo({ type: 'etd', command: 'etd' })

  expect(etdResponse).toMatchSnapshot()
})
