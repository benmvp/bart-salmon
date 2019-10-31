import rootReducer, { AppState } from './reducers'
import { StationName, SalmonRoute, Train } from '../utils/types'

const INITIAL_STATE: AppState = {
  origin: 'BALB',
  destination: '12TH',
  numSalmonRoutes: 5,
  riskinessFactor: 0,
  isFetching: false,
  salmonRoutes: [],
  arrivals: [],
  numArrivals: 3,
}
const SAMPLE_ROUTES: SalmonRoute[] = [
  {
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
  },
]
const SAMPLE_ARRIVALS: Train[] = [
  {
    abbreviation: '24TH',
    bikeflag: 1,
    color: 'YELLOW',
    destination: '24th Street',
    direction: 'South',
    hexcolor: '#ffff33',
    length: 9,
    limited: 0,
    minutes: 9,
    platform: 2,
  },
  {
    abbreviation: 'SFIA',
    bikeflag: 1,
    color: 'YELLOW',
    destination: 'SF Airport',
    direction: 'South',
    hexcolor: '#ffff33',
    length: 10,
    limited: 0,
    minutes: 12,
    platform: 2,
  },
  {
    abbreviation: '24TH',
    bikeflag: 1,
    color: 'YELLOW',
    destination: '24th Street',
    direction: 'South',
    hexcolor: '#ffff33',
    length: 9,
    limited: 0,
    minutes: 20,
    platform: 2,
  },
  {
    abbreviation: 'SFIA',
    bikeflag: 1,
    color: 'YELLOW',
    destination: 'SF Airport',
    direction: 'South',
    hexcolor: '#ffff33',
    length: 10,
    limited: 0,
    minutes: 25,
    platform: 2,
  },
  {
    abbreviation: 'SFIA',
    bikeflag: 1,
    color: 'YELLOW',
    destination: 'SF Airport',
    direction: 'South',
    hexcolor: '#ffff33',
    length: 10,
    limited: 0,
    minutes: 40,
    platform: 2,
  },
]

it('should handle SET_STATIONS action', () => {
  const origin: StationName = 'MONT'
  const destination: StationName = 'PITT'
  const actualState = rootReducer(INITIAL_STATE, {
    type: 'SET_STATIONS',
    payload: { origin, destination },
  })
  const expectedState = {
    ...INITIAL_STATE,
    origin,
    destination,
  }

  expect(actualState).toEqual(expectedState)
})

it('should handle SET_NUM_SALMON_ROUTES action', () => {
  const numRoutes = 10
  const actualState = rootReducer(INITIAL_STATE, {
    type: 'SET_NUM_SALMON_ROUTES',
    payload: numRoutes,
  })
  const expectedState = {
    ...INITIAL_STATE,
    numSalmonRoutes: numRoutes,
  }

  expect(actualState).toEqual(expectedState)
})

it('should handle SET_RISKINESS_FACTOR action', () => {
  const riskinessFactor = 2
  const actualState = rootReducer(INITIAL_STATE, {
    type: 'SET_RISKINESS_FACTOR',
    payload: riskinessFactor,
  })
  const expectedState = {
    ...INITIAL_STATE,
    riskinessFactor,
  }

  expect(actualState).toEqual(expectedState)
})

it('should handle FETCH_SALMON_INFO action', () => {
  const actualState = rootReducer(INITIAL_STATE, { type: 'FETCH_SALMON_INFO' })
  const expectedState = {
    ...INITIAL_STATE,
    isFetching: true,
  }

  expect(actualState).toEqual(expectedState)
})

it('should handle RECEIVE_SALMON_INFO action', () => {
  const routes = SAMPLE_ROUTES
  const arrivals = SAMPLE_ARRIVALS
  const actualState = rootReducer(
    {
      ...INITIAL_STATE,
      isFetching: true,
    },
    {
      type: 'RECEIVE_SALMON_INFO',
      payload: { routes, arrivals },
    },
  )
  const expectedState = {
    ...INITIAL_STATE,
    arrivals,
    salmonRoutes: routes,
    isFetching: false,
  }

  expect(actualState).toEqual(expectedState)
})

it('should handle ERROR_SALMON_INFO action', () => {
  const actualState = rootReducer(
    {
      ...INITIAL_STATE,
      isFetching: true,
    },
    {
      type: 'ERROR_SALMON_INFO',
      error: new Error('test error'),
    },
  )
  const expectedState = {
    ...INITIAL_STATE,
    salmonRoutes: [],
    arrivals: [],
    isFetching: false,
  }

  expect(actualState).toEqual(expectedState)
})

it('should handle SET_NUM_ARRIVALS action', () => {
  const numArrivals = 10
  const actualState = rootReducer(INITIAL_STATE, {
    type: 'SET_NUM_ARRIVALS',
    payload: numArrivals,
  })
  const expectedState = {
    ...INITIAL_STATE,
    numArrivals,
  }

  expect(actualState).toEqual(expectedState)
})
