import {
  isStationARouteStation,
  areStationsOnRouteStations,
  getRouteIdsWithStartAndEnd,
  getAllDestinationsFromRoutes,
  getOppositeRouteIds,
  getTargetRouteIds,
} from './routes'
import {
  RoutesLookup,
} from './types'
import routesLookup from '../data/routes.json'

const ROUTES_LOOKUP = (<unknown>routesLookup) as RoutesLookup

describe('routes utils', () => {
  describe('isStationARouteStation', () => {
    it('returns false when station is not a route station', () => {
      expect(
        isStationARouteStation('ROCK', ROUTES_LOOKUP['ROUTE 2'].stations[0]),
      ).toBe(false)
    })

    it('returns true when station is a route station', () => {
      expect(
        isStationARouteStation('WARM', ROUTES_LOOKUP['ROUTE 5'].stations[0]),
      ).toBe(true)
    })
  })

  describe('areStationsOnRouteStations', () => {
    it('returns false when station is not on route', () => {
      expect(
        areStationsOnRouteStations(
          'PITT',
          'DBRK',
          ROUTES_LOOKUP['ROUTE 4'].stations,
        ),
      )
    })

    it('returns false when start comes after end', () => {
      expect(
        areStationsOnRouteStations(
          'BALB',
          'ASHB',
          ROUTES_LOOKUP['ROUTE 7'].stations,
        ),
      )
    })

    it('returns true when start comes before end', () => {
      expect(
        areStationsOnRouteStations(
          'SSAN',
          'EMBR',
          ROUTES_LOOKUP['ROUTE 2'].stations,
        ),
      )
    })
  })

  describe('getRouteIdsWithStartAndEnd', () => {
    it('returns empty when the same stations are passed', () => {
      expect(getRouteIdsWithStartAndEnd('SANL', 'SANL')).toHaveLength(0)
    })

    it('returns empty when the stations are not connected by direct route', () => {
      expect(getRouteIdsWithStartAndEnd('SFIA', 'FRMT')).toHaveLength(0)
    })

    it('returns single route ID for stations connected by single route', () => {
      expect(getRouteIdsWithStartAndEnd('FTVL', 'NBRK')).toEqual(['ROUTE 3'])
    })

    it('returns multiple route IDs for stations connected by multiple routes', () => {
      expect(getRouteIdsWithStartAndEnd('EMBR', '16TH')).toEqual([
        'ROUTE 1',
        'ROUTE 11',
        'ROUTE 7',
      ])
    })

    it('returns empty when stations are connected by single route but looking for different train color', () => {
      expect(
        getRouteIdsWithStartAndEnd('FTVL', 'NBRK', '#ffff33'),
      ).toHaveLength(0)
    })

    it('returns fewer routeIDs for stations connected by multiple routes when filtered by train color', () => {
      expect(getRouteIdsWithStartAndEnd('EMBR', '16TH', '#ffff33')).toEqual([
        'ROUTE 1',
      ])
    })
  })

  describe('getAllDestinationsFromRoutes', () => {
    it('returns empty when routes is empty', () => {
      let destinations = [...getAllDestinationsFromRoutes('BALB', [])]

      expect(destinations).toHaveLength(0)
    })

    it('returns empty when station is not on route', () => {
      let destinations = [...getAllDestinationsFromRoutes('BAYF', ['ROUTE 2'])]

      expect(destinations).toHaveLength(0)
    })

    it('provides destinations for station when single route is specified', () => {
      let destinations = [...getAllDestinationsFromRoutes('MCAR', ['ROUTE 7'])]

      expect(destinations).toMatchSnapshot()
    })

    it('provides destinations for station when multiple routes are specified', () => {
      let destinations = [
        ...getAllDestinationsFromRoutes('MCAR', ['ROUTE 7', 'ROUTE 1']),
      ]

      expect(destinations).toMatchSnapshot()
    })
  })

  describe('getOppositeRouteIds', () => {
    it('returns empty when target routes is empty', () => {
      expect(getOppositeRouteIds('BALB', [])).toHaveLength(0)
    })

    it('provides north routes when station is not on route', () => {
      expect(getOppositeRouteIds('BAYF', ['ROUTE 2'])).toMatchSnapshot()
    })

    it('provides north route(s) for station when single south route is specified', () => {
      expect(getOppositeRouteIds('MCAR', ['ROUTE 7'])).toMatchSnapshot()
    })

    it('provides south route(s) for station when single north route is specified', () => {
      expect(getOppositeRouteIds('LAFY', ['ROUTE 2'])).toMatchSnapshot()
    })

    it('provides north route(s) for station when multiple south routes are specified', () => {
      expect(
        getOppositeRouteIds('MCAR', ['ROUTE 7', 'ROUTE 1']),
      ).toMatchSnapshot()
    })

    it('provides south route(s) for station when multiple north routes are specified', () => {
      expect(
        getOppositeRouteIds('19TH', ['ROUTE 8', 'ROUTE 3']),
      ).toMatchSnapshot()
    })

    it('provides no routes when north and south routes are specified', () => {
      expect(
        getOppositeRouteIds('COLM', ['ROUTE 2', 'ROUTE 7']),
      ).toHaveLength(0)
    })
  })

  describe('getTargetRouteIds', () => {
    it('returns empty when stations are not directly connected (w/o transfers)', () => {
      expect(getTargetRouteIds('DUBL', 'ROCK')).toHaveLength(0)
    })

    it('returns single route when stations are singly directly connected (w/o transfers)', () => {
      expect(getTargetRouteIds('NCON', 'WCRK')).toMatchSnapshot()
    })

    it('returns multiple routes when stations are multiply directly connected (w/o transfers)', () => {
      expect(getTargetRouteIds('FRMT', 'SHAY')).toMatchSnapshot()
    })

    it('returns single route when stations are singly indirectly connected (w/ transfers)', () => {
      expect(getTargetRouteIds('CONC', 'UCTY', true)).toMatchSnapshot()
    })

    it('returns multiple routes when stations are both directly & indirectly connected (w/ transfers)', () => {
      expect(getTargetRouteIds('FRMT', 'WOAK', true)).toMatchSnapshot()
    })
  })
})
