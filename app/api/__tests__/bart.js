// @flow
import fs from 'fs'
import path from 'path'
import fetchBartInfo from '../bart'

jest.mock('../fetch')

it('correctly converts ETDs XML to JS', async () => {
    // $FlowIgnoreTest
    require('../fetch').__setMockText(
        fs.readFileSync(path.join(__dirname, '../__mocks__/etd-etd.xml'))
    )

    let etdResponse = await fetchBartInfo('etd', 'etd')

    expect(etdResponse).toMatchSnapshot()
})
