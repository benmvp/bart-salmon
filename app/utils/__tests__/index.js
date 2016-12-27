import {getSuggestedSalmonRoutes} from '../'

jest.mock('../../api')

describe('getSuggestedSalmonRoutes', () => {
    xit('returns no suggestions when at origin station (Westbound)', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('PITT', 'SFIA')

        expect(actualSalmonSuggestions).toEqual([])
    })

    xit('returns no suggestions when at origin station (Eastbound)', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('DALY', 'RICH')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions for PITT line', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('POWL', 'PITT')

        // console.log(actualSalmonSuggestions)

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions for DUBL line', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('EMBR', 'CAST')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions for RICH line', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('16TH', 'NBRK')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions for WARM line', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('MONT', 'FRMT')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions for Westbound line', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('PHIL', 'EMBR')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions when more than one Northbound line is available', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('19TH', 'PLZA')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions when more than one Southbound line is available', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('12TH', 'BAYF')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions when more than one Eastbound line is available', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('16TH', 'MCAR')

        // expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of suggestions when many Westbound lines are available', async () => {
        let actualSalmonSuggestions = await getSuggestedSalmonRoutes('WOAK', 'DALY')

        // expect(actualSalmonSuggestions).toEqual([])
    })
})
