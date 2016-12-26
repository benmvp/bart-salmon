import {getSalmonSuggestions} from '../'

jest.mock('../../api')

describe('getSalmonSuggestions', () => {
    it('returns default number of valid suggestions for POWL -> PITT (SFIA-PITT)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('POWL', 'PITT')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for EMBR -> CAST (DALY-DUBL)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('EMBR', 'CAST')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for 16TH -> NBRK (MLBR-RICH)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('16TH', 'NBRK')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for MONT -> FRMT (DALY-WARM)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('MONT', 'FRMT')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for 16TH -> MCAR (SFIA-PITT / MLBR-RICH)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('16TH', 'MCAR')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for WOAK -> DALY (MANY)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('WOAK', 'DALY')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for 19TH -> PLZA (WARM-RICH / MLBR-RICH)', async () => {
        let actualSalmonSuggestions = await getSalmonSuggestions('19TH', 'PLZA')

        expect(actualSalmonSuggestions).toEqual([])
    })
})
