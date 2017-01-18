// @flow

import {getSalmonTimeFromRoute, getSuggestedSalmonRoutesFromEtds} from '../salmon'
import etdsMorningRushLookup from '../../api/__mocks__/etds-rush-am.json'
import etdsEveningRushLookup from '../../api/__mocks__/etds-rush-pm.json'
import etdsNoondayLookup from '../../api/__mocks__/etds-noonday.json'
import etdsHolidayLookup from '../../api/__mocks__/etds-holiday.json'
import etdsMajorDelaysLookup from '../../api/__mocks__/etds-major-delays.json'
import etdsLateNightLookup from '../../api/__mocks__/etds-late-night.json'

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
        etdsLookup: etdsNoondayLookup,
        title: 'Weekday Noonday'
    },
    {
        etdsLookup: etdsHolidayLookup,
        title: 'Holidays'
    },
    {
        etdsLookup: etdsMajorDelaysLookup,
        title: 'Major Delays'
    },
    {
        etdsLookup: etdsLateNightLookup,
        title: 'Late Night'
    },
]

describe('getSalmonTimeFromRoute', () => {
    it('returns the salmon time for a given route', () => {
        let expectedSalmonTime = 18
        let actualSalmonTime = getSalmonTimeFromRoute({
            backwardsRideTime: 5,
            backwardsRouteId: 'ROUTE 3',
            backwardsStation: 'RICH',
            backwardsTrain: {
                abbreviation: 'RICH',
                bikeflag: 1,
                color: 'ORANGE',
                destination: 'Richmond',
                direction: 'North',
                hexcolor: '#ff9933',
                length: 4,
                limited: 0,
                minutes: 2,
                platform: 1
            },
            backwardsWaitTime: 7,
            returnRideTime: 4,
            returnRouteId: 'ROUTE 7',
            returnTrain: {
                abbreviation: 'MLBR',
                bikeflag: 1,
                color: 'RED',
                destination: 'Millbrae',
                direction: 'South',
                hexcolor: '#ff0000',
                length: 5,
                limited: 0,
                minutes: 14,
                platform: 2
            },
            waitTime: 2
        })

        expect(actualSalmonTime).toBe(expectedSalmonTime)
    })
})

EXAMPLE_ETDS_LOOKUPS.forEach(({etdsLookup, title}) => {
    describe(`for "${title}"`, () => {
        it('throws an error when an invalid origin is used', () => {
            expect(
                // $FlowIgnoreTest
                () => getSuggestedSalmonRoutesFromEtds(etdsLookup, 'FOO', 'COLM', 5)
            ).toThrow()
        })

        it('throws an error when an invalid destination is used', () => {
            expect(
                // $FlowIgnoreTest
                () => (getSuggestedSalmonRoutesFromEtds(etdsLookup, 'PLZA', 'BAR', 5))
            ).toThrow()
        })

        it('throws an error when origin === destination', () => {
            expect(
                () => getSuggestedSalmonRoutesFromEtds(etdsLookup, 'BALB', 'BALB', 5)
            ).toThrow()
        })

        it('returns no suggestions when 0 suggestions are requested', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'SSAN', 'WDUB', 0)

            expect(actualSalmonSuggestions).toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns single suggestion when 1 suggestion is requested', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'SANL', 'BALB', 1)

            expect(actualSalmonSuggestions).toHaveLength(1)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('does not blow up when requesting high number of suggestions', () => {
            let getSalmonSuggestions = () => getSuggestedSalmonRoutesFromEtds(etdsLookup, 'ORIN', 'MONT', 1000)

            expect(getSalmonSuggestions).not.toThrow()

            let actualSalmonSuggestions = getSalmonSuggestions()

            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns no suggestions when at origin station (Westbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'PITT', 'SFIA', 5)

            expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns no suggestions when at origin station (Eastbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'MLBR', 'RICH', 5)

            expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns suggestions for PITT line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'POWL', 'PITT', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for DUBL line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'EMBR', 'CAST', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for RICH line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, '16TH', 'NBRK', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for WARM line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'MONT', 'FRMT', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for Westbound line', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'PHIL', 'EMBR', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Northbound line is available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, '19TH', 'PLZA', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Southbound line is available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, '12TH', 'BAYF', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Eastbound line is available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, '16TH', 'MCAR', 10)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when many Westbound lines are available', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'WOAK', 'DALY', 10)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Eastbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'COLS', 'NCON', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Westbound)', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'LAFY', 'HAYW', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('includes a suggestion for a train that is leaving', () => {
            let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(etdsLookup, 'LAKE', 'PITT', 5)

            expect(actualSalmonSuggestions).not.toHaveLength(0)
            expect(actualSalmonSuggestions).toMatchSnapshot()
        })
    })
})
