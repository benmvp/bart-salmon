import {combineReducers} from 'redux'
import {SalmonRoute, StationName, Train} from '../utils/types'
import {AppAction} from './types'

const DEFAULT_NUM_SALMON_ROUTES = 4
const DEFAULT_RISKINESS_FACTOR = 0

const origin = (
  state: StationName = 'POWL',
  action: AppAction,
): StationName => {
  let newState = state

  if (action.type === 'SET_ORIGIN') {
    newState = action.payload
  }

  return newState
}

const destination = (
  state: StationName = 'PITT',
  action: AppAction,
): StationName => {
  let newState = state

  if (action.type === 'SET_DESTINATION') {
    newState = action.payload
  }

  return newState
}

const isFetching = (state: boolean = false, action: AppAction): boolean => {
  const {type} = action
  let newState = state

  if (type === 'FETCH_SALMON_INFO') {
    newState = true
  } else if (type === 'RECEIVE_SALMON_INFO' || type === 'ERROR_SALMON_INFO') {
    newState = false
  }

  return newState
}

const salmonRoutes = (
  state: SalmonRoute[] = [],
  action: AppAction,
): SalmonRoute[] => {
  let newState = state

  if (action.type === 'RECEIVE_SALMON_INFO') {
    newState = action.payload.routes
  } else if (action.type === 'ERROR_SALMON_INFO') {
    newState = []
  }

  return newState
}

const arrivals = (
  state: Train[] = [],
  action: AppAction,
): Train[] => {
  let newState = state

  if (action.type === 'RECEIVE_SALMON_INFO') {
    newState = action.payload.arrivals
  } else if (action.type === 'ERROR_SALMON_INFO') {
    newState = []
  }

  return newState
}

const numSalmonRoutes = (
  state: number = DEFAULT_NUM_SALMON_ROUTES,
  action: AppAction,
): number => {
  let newState = state

  if (action.type === 'SET_NUM_SALMON_ROUTES') {
    newState = action.payload
  }

  return newState
}

// the higher the number, the more likely you'll make the returning train after
// going backwards. Negative numbers mean the train probably would've left before
// you get there
const riskinessFactor = (
  state: number = DEFAULT_RISKINESS_FACTOR,
  action: AppAction,
): number => {
  let newState = state

  if (action.type === 'SET_RISKINESS_FACTOR') {
    newState = action.payload
  }

  return newState
}

const rootReducer = combineReducers({
  origin,
  destination,
  isFetching,
  salmonRoutes,
  arrivals,
  numSalmonRoutes,
  riskinessFactor,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
