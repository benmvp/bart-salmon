import {
  getSalmonTimeFromRoute,
  getSuggestedSalmonRoutesFromEtds,
  getNextArrivalsFromEtds,
} from './salmon'
import {
  StationName,
  EtdsLookup,
  SalmonRoute,
  Train,
} from './types'

import etdsMorningRushLookup from '../api/__mocks__/etds-rush-am.json'
import etdsEveningRushLookup from '../api/__mocks__/etds-rush-pm.json'
import etdsNoondayLookup from '../api/__mocks__/etds-noonday.json'
import etdsHolidayLookup from '../api/__mocks__/etds-holiday.json'
import etdsMajorDelaysLookup from '../api/__mocks__/etds-major-delays.json'
import etdsLateNightLookup from '../api/__mocks__/etds-late-night.json'
import etdsSaturdayLookup from '../api/__mocks__/etds-saturday.json'
import etdsSundayLookup from '../api/__mocks__/etds-sunday.json'

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
  {
    etdsLookup: (etdsSaturdayLookup as unknown) as EtdsLookup,
    title: 'Saturday',
  },
  {
    etdsLookup: (etdsSundayLookup as unknown) as EtdsLookup,
    title: 'Sunday',
  },
]

const numericSort = <T>(items: T[]): T[] => [...items].sort((a, b) => a - b)

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
    const expectValidSalmonTimes = (
      salmonSuggestions: SalmonRoute[],
      etdsLookup: EtdsLookup,
      origin: StationName,
      destination: StationName,
    ): void => {
      const salmonTimes = salmonSuggestions.map(getSalmonTimeFromRoute)

      // there should be no duplicate salmon times
      expect(salmonTimes).toEqual([...new Set(salmonTimes)])

      // the salmon times should already be in order
      expect(salmonTimes).toEqual(numericSort(salmonTimes))


      // const nextArrivals = getNextArrivalsFromEtds(etdsLookup, origin, destination)

      salmonSuggestions.forEach((salmonRoute) => {
        const salmonTime = getSalmonTimeFromRoute(salmonRoute)

        // salmon time should be a valid number
        // (can be NaN when time between stations couldn't be determined)
        expect(salmonTime).not.toBe(Number.NaN)

        // const arrivalTimesForReturnRoute = nextArrivals
        //   .filter(({ routeId }) => routeId === salmonRoute.returnRouteId)
        //   .map(({ minutes }) => minutes)
        // const highestArrivalTime = arrivalTimesForReturnRoute[arrivalTimesForReturnRoute.length - 1] || 0
        // const arrivalTimesLookup = new Set(arrivalTimesForReturnRoute)

        // // the salmon time should align with corresponding arrival time
        // // (one may not exist if the salmon time is high enough)
        // expect(
        //   arrivalTimesLookup.has(salmonTime) || salmonTime > highestArrivalTime
        // ).toBe(true)
      })

    }

    const expectValidBackwardStations = (salmonSuggestions: SalmonRoute[]): void => {
      const backwardsStations = salmonSuggestions.map(({ backwardsStation }) => backwardsStation)

      // there should be no duplicate backwards stations
      expect(backwardsStations).toEqual([...new Set(backwardsStations)])
    }

    const streamlineSalmonRoutes = (salmonSuggestions: SalmonRoute[]) => (
      salmonSuggestions.map((salmonRoute: SalmonRoute) => ({
        salmonTime: getSalmonTimeFromRoute(salmonRoute),
        waitTime: salmonRoute.waitTime,
        backwardsStation: salmonRoute.backwardsStation,
        backwardsRideTime: salmonRoute.backwardsRideTime,
        backwardsRouteId: salmonRoute.backwardsRouteId,
        backwardsWaitTime: salmonRoute.backwardsWaitTime,
        returnRideTime: salmonRoute.returnRideTime,
        returnRouteId: salmonRoute.returnRouteId,
      }))
    )

    EXAMPLE_ETDS_LOOKUPS.forEach(({ etdsLookup, title }) => {
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
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'SSAN',
            'WDUB',
            1,
            0,
          )

          expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns a single suggestion when 1 suggestion is requested', () => {
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'SANL',
            'BALB',
            1,
            1,
          )

          expect(actualSalmonSuggestions).toHaveLength(1)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('does not blow up when requesting high number of suggestions', () => {
          const origin = 'ORIN'
          const destination = 'MONT'
          const getSalmonSuggestions = () =>
            getSuggestedSalmonRoutesFromEtds(etdsLookup, origin, destination, 1, 1000)

          expect(getSalmonSuggestions).not.toThrow()

          const actualSalmonSuggestions = getSalmonSuggestions()

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns no suggestions when at origin station (Westbound)', () => {
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'ANTC',
            'SFIA',
          )

          expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns no suggestions when at origin station (Eastbound)', () => {
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            'MLBR',
            'RICH',
          )

          expect(actualSalmonSuggestions).toHaveLength(0)
        })

        it('returns suggestions for ANTC line', () => {
          const origin = 'POWL'
          const destination = 'PITT'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions for DUBL line', () => {
          const origin = 'EMBR'
          const destination = 'CAST'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions for RICH line', () => {
          const origin = '16TH'
          const destination = 'NBRK'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions for WARM line', () => {
          const origin = 'MONT'
          const destination = 'WARM'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions for Westbound line', () => {
          const origin = 'PHIL'
          const destination = 'EMBR'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when more than one Northbound line is available', () => {
          const origin = '19TH'
          const destination = 'PLZA'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when more than one Southbound line is available', () => {
          const origin = '12TH'
          const destination = 'BAYF'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when more than one Eastbound line is available', () => {
          const origin = '16TH'
          const destination = 'MCAR'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when many Westbound lines are available', () => {
          const origin = 'WOAK'
          const destination = 'DALY'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Eastbound)', () => {
          const origin = 'COLS'
          const destination = 'NCON'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed (Westbound)', () => {
          const origin = 'LAFY'
          const destination = 'HAYW'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('does not include "quick turnaround" trains that do not make it to destination when route typically does (such as NCON train)', () => {
          const origin = 'ROCK'
          const destination = 'ANTC'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )
          let foundNCONTrain = actualSalmonSuggestions.find(
            ({ returnTrain }) => returnTrain.abbreviation === 'NCON',
          )

          expect(foundNCONTrain).toBeUndefined()
          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Southside)', () => {
          const origin = 'UCTY'
          const destination = 'CAST'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Northside)', () => {
          const origin = 'ASHB'
          const destination = 'PHIL'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when origin is transfer station', () => {
          const origin = 'LAKE'
          const destination = 'HAYW'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when riskiness factor is 0', () => {
          const origin = 'CIVC'
          const destination = '19TH'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
            0,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })

        it('returns suggestions when riskiness factor is negative', () => {
          const origin = 'EMBR'
          const destination = 'WDUB'
          const actualSalmonSuggestions = getSuggestedSalmonRoutesFromEtds(
            etdsLookup,
            origin,
            destination,
            -1,
          )

          expect(actualSalmonSuggestions).not.toHaveLength(0)
          expectValidSalmonTimes(actualSalmonSuggestions, etdsLookup, origin, destination)
          expectValidBackwardStations(actualSalmonSuggestions)
          expect(streamlineSalmonRoutes(actualSalmonSuggestions)).toMatchSnapshot()
        })
      })
    })
  })

  describe('getNextArrivalsFromEtds', () => {
    const expectArrivalTimes = (nextArrivals: Train[]): void => {
      const arrivalTimes = nextArrivals.map(({ minutes }) => minutes)

      // times should be in order
      expect(arrivalTimes).toEqual(numericSort(arrivalTimes))
    }

    EXAMPLE_ETDS_LOOKUPS.forEach(({ etdsLookup, title }) => {
      describe(`for "${title}"`, () => {
        it('throws an error when an invalid origin is used', () => {
          expect(
            () => getNextArrivalsFromEtds(etdsLookup, 'FOO' as StationName, 'COLM'),
          ).toThrow()
        })

        it('throws an error when an invalid destination is used', () => {
          expect(
            () => getNextArrivalsFromEtds(etdsLookup, 'PLZA', 'BAR' as StationName),
          ).toThrow()
        })

        it('throws an error when origin === destination', () => {
          expect(() =>
            getNextArrivalsFromEtds(etdsLookup, 'BALB', 'BALB'),
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
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'SANL',
            'BALB',
            1,
          )

          expect(actualArrivals).toHaveLength(1)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('does not blow up when requesting high number of arrivals', () => {
          const getArrivals = () =>
            getNextArrivalsFromEtds(etdsLookup, 'ORIN', 'MONT', 1000)

          expect(getArrivals).not.toThrow()

          const actualArrivals = getArrivals()

          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns all the arrivals when `numArrivals` is omitted', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'SANL',
            'BALB',
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns arrivals when at origin station', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'PITT',
            'SFIA',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns arrivals when more than one line is available', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            '19TH',
            'PLZA',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns arrivals when many lines are available', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'WOAK',
            'DALY',
            10,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns suggestions when changing trains is needed', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'LAFY',
            'HAYW',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('includes an arrival for a train that is leaving', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'LAKE',
            'PITT',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('does not include "quick turnaround" trains that do not make it to destination when route typically does (such as NCON train)', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'ROCK',
            'PITT',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Southside)', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'UCTY',
            'CAST',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })

        it('returns suggestions when changing trains in opposite direction (Northside)', () => {
          const actualArrivals = getNextArrivalsFromEtds(
            etdsLookup,
            'ASHB',
            'PHIL',
            5,
          )

          expect(actualArrivals).not.toHaveLength(0)
          expectArrivalTimes(actualArrivals)
          expect(actualArrivals).toMatchSnapshot()
        })
      })
    })
  })
})
