import { setStations, setNumSalmonRoutes, getSalmonInfo } from './actions'
import { AppState } from './reducers'
import { StationName } from '../utils/types'

jest.mock('../api')

const MOCK_APP_STATE: AppState = ({
  origin: 'DELN',
  destination: 'EMBR',
  numSalmonRoutes: 3,
  riskinessFactor: 1,
  isFetching: false,
  salmonRoutes: [],
  arrivals: [],
})
const MOCK_GET_STATE = () => MOCK_APP_STATE

describe('setStations', () => {
  it('dispatches SET_STATIONS action w/ specified origin/destination', async () => {
    const mockDispatch = jest.fn()
    const origin: StationName = 'WDUB'
    const destination: StationName = 'NCON'
    const asyncAction = setStations({ origin, destination })

    await asyncAction(mockDispatch, MOCK_GET_STATE, null)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATIONS',
      payload: { origin, destination },
    })
  })

  it('dispatches getSalmonInfo action', () => {
    // TODO
  })
})

describe('setNumSalmonRoutes', () => {
  it('returns SET_NUM_SALMON_ROUTES action w/ specified amount', () => {
    let numRoutes = 19
    let action = setNumSalmonRoutes(numRoutes)

    expect(action).toEqual({
      type: 'SET_NUM_SALMON_ROUTES',
      payload: numRoutes,
    })
  })
})

describe('getSalmonInfo', () => {
  it('dispatches FETCH_SALMON_INFO action', async () => {
    let mockDispatch = jest.fn()
    let asyncAction = getSalmonInfo()

    await asyncAction(mockDispatch, MOCK_GET_STATE, undefined)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'FETCH_SALMON_INFO' })
  })

  it('dispatches RECEIVE_SALMON_INFO action', async () => {
    const mockDispatch = jest.fn()
    const asyncAction = getSalmonInfo()
    const getState = () => ({
      origin: 'DELN',
      destination: 'EMBR',
      numSalmonRoutes: 3,
      riskinessFactor: 1,
      isFetching: false,
      salmonRoutes: [],
      arrivals: [],
      numArrivals: 3,
    }) as AppState

    await asyncAction(mockDispatch, getState, undefined)

    expect(mockDispatch).toHaveBeenCalledTimes(2)

    const actualReceiveActionType = mockDispatch.mock.calls[1][0]

    expect(actualReceiveActionType).toEqual(expect.objectContaining({
      type: 'RECEIVE_SALMON_INFO',
      payload: {
        arrivals: expect.any(Array),
        routes: expect.any(Array),
      }
    }))
  })

  it('dispatches ERROR_SALMON_INFO action', async () => {
    let mockDispatch = jest.fn()
    let asyncAction = getSalmonInfo()
    let getState = () => ({
      origin: '24TH',
      destination: '24TH',
      numSalmonRoutes: 7,
      riskinessFactor: 2,
      isFetching: false,
      salmonRoutes: [],
      arrivals: [],
      numArrivals: 3,
    }) as AppState

    await asyncAction(mockDispatch, getState, null)

    expect(mockDispatch).toHaveBeenCalledTimes(2)

    let actualErrorActionType = mockDispatch.mock.calls[1][0]

    expect(actualErrorActionType).toEqual({
      type: 'ERROR_SALMON_INFO',
      error: expect.any(Error),
    })
  })
})
