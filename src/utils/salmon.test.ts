import {
  getSalmonTimeFromRoute,
  getSuggestedSalmonRoutesFromEtds,
  getNextArrivalsFromEtds,
} from './salmon'
import {
  StationName,
  EtdsLookup,
} from './types'

import etdsMorningRushLookup from '../api/__mocks__/etds-rush-am.json'
import etdsEveningRushLookup from '../api/__mocks__/etds-rush-pm.json'
import etdsNoondayLookup from '../api/__mocks__/etds-noonday.json'
import etdsHolidayLookup from '../api/__mocks__/etds-holiday.json'
import etdsMajorDelaysLookup from '../api/__mocks__/etds-major-delays.json'
import etdsLateNightLookup from '../api/__mocks__/etds-late-night.json'

const EXAMPLE_ETDS_LOOKUPS = [
  {
    etdsLookup: (etdsMorningRushLookup as unknown) as EtdsLookup,
    title: 'Morning Rush',
  },
  {
    etdsLookup: (etdsEveningRushLookup as unknown) as EtdsLookup,
    title: 'Evening Rush',
  },
  {
    etdsLookup: (etdsNoondayLookup as unknown) as EtdsLookup,
    title: 'Weekday Noonday',
  },
  {
    etdsLookup: (etdsHolidayLookup as unknown) as EtdsLookup,
    title: 'Holidays',
  },
  {
    etdsLookup: (etdsMajorDelaysLookup as unknown) as EtdsLookup,
    title: 'Major Delays',
  },
  {
    etdsLookup: (etdsLateNightLookup as unknown) as EtdsLookup,
    title: 'Late Night',
  },
]

describe('salmon utils', () => {
  describe('getSalmonTimeFromRoute', () => {
    it('returns the salmon time for a given route', () => {
      const expectedSalmonTime = 18
      const actualSalmonTime = getSalmonTimeFromRoute({
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
          platform: 1,
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
          platform: 2,
        },
        waitTime: 2,
      })

      expect(actualSalmonTime).toBe(expectedSalmonTime)
    })
  })

  describe('getSuggestedSalmonRoutesFromEtds', () => {
    EXAMPLE_ETDS_LOOKUPS.forEach(({etdsLookup, title}) => {
      describe(`for "${title}"`, () => {
        it('throws an error when an invalid origin is used', () => {
          expect(
            () => getSuggestedSalmonRoutesFromEtds(etdsLookup, 'FOO' as StationName, 'COLM'),
          ).toThrow()
        })

        it('throws an error when an invalid destination is used', () => {
          expect(
            () => getSuggestedSalmonRoutesFromEtds(etdsLookup, 'PLZA', 'BAR' as StationName),
          ).toThrow()
        })

        it('throws an error when origin === destination', () => {
          expect(() =>
            getSuggestedSalmonRoutesFromEtds(etdsLookup, 'BALB', 'BALB'),
          ).toThrow()
        })

        it('returns no suggestions when 0 suggestions are requested', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'SSAN',
            'WDUB',
            0,
          )

          expect(actualSalmonSuggestions).toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns single suggestion when 1 suggestion is requested', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'SANL',
            'BALB',
            1,
          )

          expect(actualSalmonSuggestions).toHaveLength(1)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('does not blow up when requesting high number of suggestions', () => {
          let getSalmonSuggestions = () =>
            getSuggestedSalmonRoutesFromEtds(etdsLookup, 'ORIN', 'MONT', 1000)

          expect(getSalmonSuggestions).not.toThrow()

          let actualSalmonSuggestions = getSalmonSuggestions()

          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns no suggestions when at origin station (Westbound)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'PITT',
            'SFIA',
          )

          expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns no suggestions when at origin station (Eastbound)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'MLBR',
            'RICH',
          )

          expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns suggestions for PITT line', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'POWL',
            'PITT',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for DUBL line', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'EMBR',
            'CAST',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for RICH line', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            '16TH',
            'NBRK',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for WARM line', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'MONT',
            'FRMT',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions for Westbound line', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'PHIL',
            'EMBR',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Northbound line is available', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            '19TH',
            'PLZA',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Southbound line is available', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            '12TH',
            'BAYF',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when more than one Eastbound line is available', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            '16TH',
            'MCAR',
            10,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when many Westbound lines are available', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'WOAK',
            'DALY',
            10,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Eastbound)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'COLS',
            'NCON',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Westbound)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'LAFY',
            'HAYW',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('includes a suggestion for a train that is leaving', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'LAKE',
            'PITT',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('does not include "quick turnaround" trains that do not make it to destination when route typically does (such as NCON train)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'ROCK',
            'PITT',
          )
          let foundNCONTrain = actualSalmonSuggestions.find(
            ({returnTrain}) => returnTrain.abbreviation === 'NCON',
          )

          expect(foundNCONTrain).toBeUndefined()
          expect(actualSalmonSuggestions).not.toHaveLength(0)
        })

        it('returns suggestions when changing trains in opposite direction (Southside)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'UCTY',
            'CAST',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Northside)', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'ASHB',
            'PHIL',
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when riskiness factor is 0', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'CIVC',
            '19TH',
            5,
            0,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })

        it('returns suggestions when riskiness factor is negative', () => {
          let actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'EMBR',
            'WDUB',
            5,
            -1,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(actualSalmonSuggestions).toMatchSnapshot()
        })
      })
    })
  })

  describe('getNextArrivalsFromEtds', () => {
    EXAMPLE_ETDS_LOOKUPS.forEach(({etdsLookup, title}) => {
      describe(`for "${title}"`, () => {
        it('throws an error when an invalid origin is used', () => {
          expect(
            () => getNextArrivalsFromEtds(etdsLookup, 'FOO' as StationName, 'COLM', 5),
          ).toThrow()
        })

        it('throws an error when an invalid destination is used', () => {
          expect(
            () => getNextArrivalsFromEtds(etdsLookup, 'PLZA', 'BAR' as StationName, 5),
          ).toThrow()
        })

        it('throws an error when origin === destination', () => {
          expect(() =>
            getNextArrivalsFromEtds(etdsLookup, 'BALB', 'BALB', 5),
          ).toThrow()
        })

        it('returns no arrivals when 0 are requested', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'SSAN',
            'WDUB',
            0,
          )

          expect(actualArrivals).toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns single arrival when 1 is requested', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'SANL',
            'BALB',
            1,
          )

          expect(actualArrivals).toHaveLength(1)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('does not blow up when requesting high number of arrivals', () => {
          let getArrivals = () =>
            getNextArrivalsFromEtds(etdsLookup, 'ORIN', 'MONT', 1000)

          expect(getArrivals).not.toThrow()

          let actualArrivals = getArrivals()

          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns arrivals when at origin station', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'PITT',
            'SFIA',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns arrivals when more than one line is available', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            '19TH',
            'PLZA',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns arrivals when many lines are available', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'WOAK',
            'DALY',
            10,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'LAFY',
            'HAYW',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('includes an arrival for a train that is leaving', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'LAKE',
            'PITT',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('does not include "quick turnaround" trains that do not make it to destination when route typically does (such as NCON train)', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'ROCK',
            'PITT',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Southside)', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'UCTY',
            'CAST',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Northside)', () => {
          let actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'ASHB',
            'PHIL',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expect(actualArrivals).toMatchSnapshot()
        })
      })
    })
  })
})
