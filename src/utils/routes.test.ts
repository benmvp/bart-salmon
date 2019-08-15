import {
  areStationsOnRouteStations,
  getRouteIdsWithStartAndEnd,
  getOppositeRouteIds,
  getTargetRouteIds,
  getTargetDirections,
  getMinutesBetweenStation,
  trainsThatGoAllTheWayFilter,
  // areTrainsSimilar,
} from './routes'
import {
  RoutesLookup,
  StationRoutesLookup,
  Train,
} from './types'
import routesLookup from '../data/routes.json'
import stationRoutesLookup from '../data/station-routes.json'

const ROUTES_LOOKUP = (routesLookup as unknown) as RoutesLookup
const STATION_ROUTES_LOOKUP = (stationRoutesLookup as unknown) as StationRoutesLookup

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
    expect(getRouteIdsWithStartAndEnd('SANL', 'SANL')).toEqual([])
  })

  it('returns empty when the stations are not connected by direct route', () => {
    expect(getRouteIdsWithStartAndEnd('SFIA', 'FRMT')).toEqual([])
  })

  it('returns single route ID for stations connected by single route', () => {
    expect(getRouteIdsWithStartAndEnd('FTVL', 'NBRK')).toEqual(['ROUTE 3'])
  })

  it('returns multiple route IDs for stations connected by multiple routes', () => {
    expect(
      getRouteIdsWithStartAndEnd('EMBR', '16TH')
    ).toEqual(['ROUTE 1', 'ROUTE 11', 'ROUTE 7', 'ROUTE 5'])
  })

  it('returns matching color route IDs first for stations connected by multiple routes when filtered by train color', () => {
    expect(
      getRouteIdsWithStartAndEnd('EMBR', '16TH', '#ff0000')
    ).toEqual(['ROUTE 7', 'ROUTE 1', 'ROUTE 11', 'ROUTE 5'])
  })

  it('returns route ID when stations are connected by single route even when looking for different train color', () => {
    expect(
      getRouteIdsWithStartAndEnd('FTVL', 'NBRK', '#ffff33'),
    ).toEqual(['ROUTE 3'])
  })
})

describe('getOppositeRouteIds', () => {
  it('returns empty when target routes is empty', () => {
    expect(getOppositeRouteIds('BALB', new Set())).toEqual(new Set())
  })

  it('returns empty when station is not on route', () => {
    expect(getOppositeRouteIds('BAYF', new Set(['ROUTE 2']))).toEqual(new Set())
  })

  it('provides north route(s) for station when single south route is specified', () => {
    expect(
      getOppositeRouteIds('MCAR', new Set(['ROUTE 7']))
    ).toEqual(new Set(['ROUTE 2', 'ROUTE 3', 'ROUTE 8']))
  })

  it('provides south route(s) for station when single north route is specified', () => {
    expect(
      getOppositeRouteIds('LAFY', new Set(['ROUTE 2']))
    ).toEqual(new Set(['ROUTE 1']))
  })

  it('provides north route(s) for station when multiple south routes are specified', () => {
    expect(
      getOppositeRouteIds('MCAR', new Set(['ROUTE 7', 'ROUTE 1'])),
    ).toEqual(new Set(['ROUTE 2', 'ROUTE 3', 'ROUTE 8']))
  })

  it('provides south route(s) for station when multiple north routes are specified', () => {
    expect(
      getOppositeRouteIds('19TH', new Set(['ROUTE 8', 'ROUTE 3'])),
    ).toEqual(new Set(['ROUTE 1', 'ROUTE 4', 'ROUTE 7', 'ROUTE 10']))
  })

  it('provides all routes for station when north and south routes are specified', () => {
    expect(
      getOppositeRouteIds('COLM', new Set(['ROUTE 2', 'ROUTE 7'])),
    ).toEqual(new Set(['ROUTE 1', 'ROUTE 7', 'ROUTE 2', 'ROUTE 8']))
  })
})

describe('getTargetRouteIds', () => {
  it('returns empty when stations are not directly connected (w/o transfers)', () => {
    expect(getTargetRouteIds('DUBL', 'ROCK')).toEqual(new Set())
  })

  it('returns single route when stations are singly directly connected (w/o transfers)', () => {
    expect(getTargetRouteIds('NCON', 'WCRK')).toEqual(new Set(['ROUTE 1']))
  })

  it('returns multiple routes when stations are multiply directly connected (w/o transfers)', () => {
    expect(getTargetRouteIds('FRMT', 'SHAY')).toEqual(new Set(['ROUTE 3', 'ROUTE 5']))
  })

  it('returns single route when stations are singly indirectly connected (w/ transfers)', () => {
    expect(getTargetRouteIds('CONC', 'UCTY', true)).toEqual(new Set(['ROUTE 1']))
  })

  it('returns multiple routes when stations are both directly & indirectly connected (w/ transfers)', () => {
    expect(getTargetRouteIds('FRMT', 'WOAK', true)).toEqual(new Set(['ROUTE 5', 'ROUTE 3']))
  })
})

describe('getTargetDirections', () => {
  it('returns empty when with empty route IDs', () => {
    expect(getTargetDirections('BALB', new Set())).toEqual(new Set())
  })

  it('returns empty when station is not on target routes', () => {
    expect(getTargetDirections('CONC', new Set(['ROUTE 13']))).toEqual(new Set())
  })

  it('returns "South" for station when single south route is specified', () => {
    expect(getTargetDirections('ANTC', new Set(['ROUTE 1']))).toEqual(new Set(['South']))
  })

  it('returns "North" for station when single north route is specified', () => {
    expect(getTargetDirections('PCTR', new Set(['ROUTE 2']))).toEqual(new Set(['North']))
  })

  it('returns "South" for station when multiple south routes are specified', () => {
    expect(
      getTargetDirections('SFIA', new Set(['ROUTE 14', 'ROUTE 1'])),
    ).toEqual(new Set(['South']))
  })

  it('returns "North" for station when multiple north routes are specified', () => {
    expect(
      getTargetDirections('SBRN', new Set(['ROUTE 8', 'ROUTE 2'])),
    ).toEqual(new Set(['North']))
  })

  it('returns both directions for station when north and south routes are specified', () => {
    expect(
      getTargetDirections('MONT', new Set(['ROUTE 5', 'ROUTE 6'])),
    ).toEqual(new Set(['South', 'North']))
  })
})

describe('getMinutesBetweenStation', () => {
  it('returns the time between two stations connected on the same route', () => {
    expect(getMinutesBetweenStation('SBRN', 'POWL', 'ROUTE 8')).toEqual(
      STATION_ROUTES_LOOKUP.SBRN.POWL.time
    )
  })

  it('returns 1000 if the stations are not on the same route', () => {
    expect(getMinutesBetweenStation('ANTC', 'DUBL', 'ROUTE 2')).toEqual(1000)
  })

  it('returns 1000 if the stations are the same', () => {
    expect(getMinutesBetweenStation('WARM', 'WARM', 'ROUTE 4')).toEqual(1000)
  })
})

describe('filterForTrainsThatGoAllTheWay', () => {
  const MOCK_TRAIN: Train = {
    destination: 'Pleasant Hill',
    abbreviation: 'PHIL',
    limited: 1,
    minutes: 0,
    platform: 2,
    direction: 'North',
    length: 4,
    color: 'YELLOW',
    hexcolor: '#ffff33',
    bikeflag: 1,
    delay: 0,
  }

  it('returns true if transfers are allowed', () => {
    expect(
      trainsThatGoAllTheWayFilter(
        new Set(['ROUTE 2']),
        true,
        MOCK_TRAIN,
        '19TH',
      )
    ).toBe(true)
  })

  it('returns true if no destination is specified', () => {
    expect(
      trainsThatGoAllTheWayFilter(
        new Set(['ROUTE 2']),
        false,
        MOCK_TRAIN,
      )
    ).toBe(true)
  })

  it('returns true if the train terminates at desired destination are the same', () => {
    expect(
      trainsThatGoAllTheWayFilter(
        new Set(['ROUTE 2']),
        false,
        MOCK_TRAIN,
        'PHIL',
      )
    ).toBe(true)
  })

  it('returns true if the train goes past the desired destination', () => {
    expect(
      trainsThatGoAllTheWayFilter(
        new Set(['ROUTE 2']),
        false,
        MOCK_TRAIN,
        'MCAR',
      )
    ).toBe(true)
  })

  it('returns false if the train stops short of the desired destination', () => {
    expect(
      trainsThatGoAllTheWayFilter(
        new Set(['ROUTE 2']),
        false,
        MOCK_TRAIN,
        'PITT',
      )
    ).toBe(false)
  })

  it('returns false if the train goes nowhere near the desired destination', () => {
    expect(
      trainsThatGoAllTheWayFilter(
        new Set(['ROUTE 2']),
        false,
        MOCK_TRAIN,
        'HAYW',
      )
    ).toBe(false)
  })
})

describe('areTrainsSimilar', () => {

})
