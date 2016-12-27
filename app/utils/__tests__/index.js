import {getSuggestedSalmonRoutes} from '../'

jest.mock('../../api')

describe('getSuggestedSalmonRoutes', () => {
    describe('w/ default sugestions', () => {
        it('returns no suggestions when at origin station (Westbound)', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('PITT', 'SFIA')

            expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns no suggestions when at origin station (Eastbound)', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('MLBR', 'RICH')

            expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions for PITT line', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('POWL', 'PITT')

            // console.log(actualSalmonSuggestions)

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions for DUBL line', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('EMBR', 'CAST')

            // console.log(actualSalmonSuggestions)

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions for RICH line', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('16TH', 'NBRK')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions for WARM line', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('MONT', 'FRMT')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions for Westbound line', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('PHIL', 'EMBR')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions when more than one Northbound line is available', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('19TH', 'PLZA')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions when more than one Southbound line is available', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('12TH', 'BAYF')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions when more than one Eastbound line is available', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('16TH', 'MCAR')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions when many Westbound lines are available', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('WOAK', 'DALY')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions when changing trains is needed (Eastbound)', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('COLS', 'NCON')

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns suggestions when changing trains is needed (Westbound)', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('LAFY', 'HAYW')

            // expect(actualSalmonSuggestions).toEqual([])
        })
    })

    describe('w/ specified suggestions', () => {
        it('returns no suggestions when 0 suggestions are requested', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('SSAN', 'WDUB', 0)

            expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns single suggestion when 1 suggestion is requested', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('UCTY', 'BALB', 1)

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns 3 suggestions when 3 suggestion are requested', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('24TH', 'ROCK', 3)

            // expect(actualSalmonSuggestions).toEqual([])
        })

        it('returns 10 suggestions when 10 suggestion are requested', async () => {
            let actualSalmonSuggestions = await getSuggestedSalmonRoutes('MONT', 'OAKL', 10)

            // expect(actualSalmonSuggestions).toEqual([])
        })
    })
})
