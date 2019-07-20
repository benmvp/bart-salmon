import fs from 'fs'
import path from 'path'
import fetchBartInfo from './bart'

jest.mock('./fetch')

it('correctly converts ETDs XML to JS', async () => {
  require('./fetch').__setMockText(
    fs.readFileSync(path.join(__dirname, './__mocks__/etd-etd.xml')),
  )

  const etdResponse = await fetchBartInfo({type: 'etd', command: 'etd'})

  expect(etdResponse).toMatchSnapshot()
})
