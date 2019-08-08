import { setOrigin, setDestination, setNumSalmonRoutes, getSalmonInfo } from './actions'
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

describe('setOrigin', () => {
  it('dispatches SET_ORIGIN action w/ specified station', async () => {
    let mockDispatch = jest.fn()
    let name = 'WDUB' as StationName
    let asyncAction = setOrigin(name)

    await asyncAction(mockDispatch, MOCK_GET_STATE, null)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_ORIGIN',
      payload: name,
    })
  })

  it('dispatches getSalmonInfo action', () => {
    // TODO
  })
})

describe('setDestination', () => {
  it('returns SET_DESTINATION action w/ specified station', async () => {
    let mockDispatch = jest.fn()
    let name = 'NCON' as StationName
    let asyncAction = setDestination(name)

    await asyncAction(mockDispatch, MOCK_GET_STATE, null)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_DESTINATION',
      payload: name,
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

    await asyncAction(mockDispatch, MOCK_GET_STATE, null)

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
    }) as AppState

    await asyncAction(mockDispatch, getState, undefined)

    expect(mockDispatch).toHaveBeenCalledTimes(2)

    const actualReceiveActionType = mockDispatch.mock.calls[1][0]

    expect(actualReceiveActionType).toMatchSnapshot()
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
