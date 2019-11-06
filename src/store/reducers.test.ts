import rootReducer from './reducers'
import { StationName } from '../utils/types'
import { MOCK_ARRIVALS, MOCK_ROUTES, MOCK_INITIAL_STATE } from './mock-data'


it('handles SET_STATIONS action', () => {
  const origin: StationName = 'MONT'
  const destination: StationName = 'PITT'
  const actualState = rootReducer(MOCK_INITIAL_STATE, {
    type: 'SET_STATIONS',
    payload: { origin, destination },
  })
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    origin,
    destination,
  }

  expect(actualState).toEqual(expectedState)
})

it('handles SET_NUM_SALMON_ROUTES action', () => {
  const numRoutes = 10
  const actualState = rootReducer(MOCK_INITIAL_STATE, {
    type: 'SET_NUM_SALMON_ROUTES',
    payload: numRoutes,
  })
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    numSalmonRoutes: numRoutes,
  }

  expect(actualState).toEqual(expectedState)
})

it('handles SET_RISKINESS_FACTOR action', () => {
  const riskinessFactor = 2
  const actualState = rootReducer(MOCK_INITIAL_STATE, {
    type: 'SET_RISKINESS_FACTOR',
    payload: riskinessFactor,
  })
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    riskinessFactor,
  }

  expect(actualState).toEqual(expectedState)
})

it('handles FETCH_SALMON_INFO action', () => {
  const actualState = rootReducer(MOCK_INITIAL_STATE, { type: 'FETCH_SALMON_INFO' })
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    isFetching: true,
  }

  expect(actualState).toEqual(expectedState)
})

it('handles RECEIVE_SALMON_INFO action', () => {
  const routes = MOCK_ROUTES
  const arrivals = MOCK_ARRIVALS
  const lastUpdated = new Date()
  const actualState = rootReducer(
    {
      ...MOCK_INITIAL_STATE,
      isFetching: true,
    },
    {
      type: 'RECEIVE_SALMON_INFO',
      payload: { routes, arrivals, lastUpdated },
    },
  )
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    arrivals,
    salmonRoutes: routes,
    isFetching: false,
    lastUpdated,
  }

  expect(actualState).toEqual(expectedState)
})

it('handles ERROR_SALMON_INFO action', () => {
  const actualState = rootReducer(
    {
      ...MOCK_INITIAL_STATE,
      isFetching: true,
    },
    {
      type: 'ERROR_SALMON_INFO',
      error: new Error('test error'),
    },
  )
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    salmonRoutes: [],
    arrivals: [],
    isFetching: false,
  }

  expect(actualState).toEqual(expectedState)
})

it('handles SET_NUM_ARRIVALS action', () => {
  const numArrivals = 10
  const actualState = rootReducer(MOCK_INITIAL_STATE, {
    type: 'SET_NUM_ARRIVALS',
    payload: numArrivals,
  })
  const expectedState = {
    ...MOCK_INITIAL_STATE,
    numArrivals,
  }

  expect(actualState).toEqual(expectedState)
})
