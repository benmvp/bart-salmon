import {getSalmonSuggestions} from './'
import mockEstimatedDepartureTimes from '../../_mockData/edts.json'

describe('getSalmonSuggestions', () => {
    it('returns default number of valid suggestions for POWL -> PITT (SFIA-PITT)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('POWL', 'PITT')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for EMBR -> CAST (DALY-DUBL)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('EMBR', 'CAST')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for 16TH -> NBRK (MLBR-RICH)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('16TH', 'NBRK')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for MONT -> FRMT (DALY-WARM)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('MONT', 'FRMT')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for 16TH -> MCAR (SFIA-PITT / MLBR-RICH)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('16TH', 'MCAR')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for WOAK -> DALY (MANY)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('WOAK', 'DALY')

        expect(actualSalmonSuggestions).toEqual([])
    })

    it('returns default number of valid suggestions for 19TH -> PLZA (WARM-RICH)', () => {
        let actualSalmonSuggestions = getSalmonSuggestions('19TH', 'PLZA')

        expect(actualSalmonSuggestions).toEqual([])
    })
})
