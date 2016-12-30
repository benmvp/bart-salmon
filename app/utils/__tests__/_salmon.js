import getSuggestedSalmonRoutesFromETDs from '../_salmon'
import etdsHolidayLookup from '../../api/__mocks__/etds-holiday.json'

const EXAMPLE_ETDS_LOOKUPS = [
    {
        etdsLookup: etdsHolidayLookup,
        title: 'Holidays'
    }
]

EXAMPLE_ETDS_LOOKUPS.forEach(({etdsLookup, title}) => {
    describe(`for "${title}"`, () => {
        it('returns no suggestions when 0 suggestions are requested', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'SSAN', 'WDUB', 0)

            expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns single suggestion when 1 suggestion is requested', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'SANL', 'BALB', 1)

            expect(actualSalmonSuggestions).toHaveLength(1)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('does not blow up when requesting high number of suggestions', () => {
            let getSalmonSuggestions = () => getSuggestedSalmonRoutesFromETDs(etdsLookup, 'ORIN', 'MONT', 1000)

            expect(getSalmonSuggestions).not.toThrow()

            let actualSalmonSuggestions = getSalmonSuggestions()

            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns no suggestions when at origin station (Westbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'PITT', 'SFIA', 5)

            expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns no suggestions when at origin station (Eastbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'MLBR', 'RICH', 5)

            expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns suggestions for PITT line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'POWL', 'PITT', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for DUBL line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'EMBR', 'CAST', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for RICH line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '16TH', 'NBRK', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        xit('returns suggestions for WARM line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'MONT', 'FRMT', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for Westbound line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'PHIL', 'EMBR', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Northbound line is available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '19TH', 'PLZA', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        xit('returns suggestions when more than one Southbound line is available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '12TH', 'BAYF', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Eastbound line is available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, '16TH', 'MCAR', 10)

            expect(actualSalmonSuggestions).toHaveLength(10)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when many Westbound lines are available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'WOAK', 'DALY', 10)

            expect(actualSalmonSuggestions).toHaveLength(10)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        xit('returns suggestions when changing trains is needed (Eastbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'COLS', 'NCON', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        xit('returns suggestions when changing trains is needed (Westbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'LAFY', 'HAYW', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })
    })
})
