import getSuggestedSalmonRoutesFromETDs from '../_salmon'
import etdsMorningRushLookup from '../../api/__mocks__/etds-rush-am.json'
import etdsEveningRushLookup from '../../api/__mocks__/etds-rush-pm.json'
import etdsHolidayLookup from '../../api/__mocks__/etds-holiday.json'

const EXAMPLE_ETDS_LOOKUPS = [
    {
        etdsLookup: etdsMorningRushLookup,
        title: 'Morning Rush'
    },
    {
        etdsLookup: etdsEveningRushLookup,
        title: 'Evening Rush'
    },
    {
        etdsLookup: etdsHolidayLookup,
        title: 'Holidays'
    },
]

EXAMPLE_ETDS_LOOKUPS.forEach(({etdsLookup, title}) => {
    describe(`for "${title}"`, () => {
        it('throws an error when an invalid origin is used', () => {
            expect(
                () => getSuggestedSalmonRoutesFromETDs(etdsLookup, 'FOO', 'COLM')
            ).toThrow()
        })

        it('throws an error when an invalid destination is used', () => {
            expect(
                () => getSuggestedSalmonRoutesFromETDs(etdsLookup, 'PLZA', 'BAR')
            ).toThrow()
        })

        it('throws an error when origin === destination', () => {
            expect(
                () => getSuggestedSalmonRoutesFromETDs(etdsLookup, 'BALB', 'BALB')
            ).toThrow()
        })

        it('returns no suggestions when 0 suggestions are requested', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'SSAN', 'WDUB', 0)

            expect(actualSalmonSuggestions).toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
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

        it('returns suggestions for WARM line', () => {
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

        it('returns suggestions when more than one Southbound line is available', () => {
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

        it('returns suggestions when changing trains is needed (Eastbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'COLS', 'NCON', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Westbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromETDs(etdsLookup, 'LAFY', 'HAYW', 5)

            expect(actualSalmonSuggestions).toHaveLength(5)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })
    })
})
