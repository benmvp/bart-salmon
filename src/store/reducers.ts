import { combineReducers } from 'redux'
import { SalmonRoute, Train } from '../utils/types'
import { AppAction, OptionalStationName } from './types'
import {
  DEFAULT_NUM_ARRIVALS,
  DEFAULT_NUM_SALMON_ROUTES,
  DEFAULT_RISKINESS_FACTOR,
} from './constants'


//////// DATA ////////

const origin = (
  state: OptionalStationName = '',
  action: AppAction,
): OptionalStationName => {
  if (action.type === 'SET_STATIONS') {
    return action.payload.origin
  }

  return state
}

const destination = (
  state: OptionalStationName = '',
  action: AppAction,
): OptionalStationName => {
  if (action.type === 'SET_STATIONS') {
    return action.payload.destination
  }

  return state
}

const isFetching = (state: boolean = false, action: AppAction): boolean => {
  const { type } = action
  if (type === 'FETCH_SALMON_INFO') {
    return true
  } else if (type === 'RECEIVE_SALMON_INFO' || type === 'ERROR_SALMON_INFO') {
    return false
  }

  return state
}

const salmonRoutes = (
  state: SalmonRoute[] | null = null,
  action: AppAction,
): SalmonRoute[] | null => {
  if (action.type === 'RECEIVE_SALMON_INFO') {
    return action.payload.routes
  } else if (action.type === 'SET_STATIONS' || action.type === 'ERROR_SALMON_INFO') {
    return null
  }

  return state
}

const arrivals = (
  state: Train[] | null = null,
  action: AppAction,
): Train[] | null => {
  if (action.type === 'RECEIVE_SALMON_INFO') {
    return action.payload.arrivals
  } else if (action.type === 'SET_STATIONS' || action.type === 'ERROR_SALMON_INFO') {
    return null
  }

  return state
}

const lastUpdated = (state: Date | null = null, action: AppAction): Date | null => {
  if (action.type === 'RECEIVE_SALMON_INFO') {
    return action.payload.lastUpdated
  } else if (action.type === 'ERROR_SALMON_INFO') {
    return null
  }

  return state
}

//////// UI Configuration ////////

const numSalmonRoutes = (
  state: number = DEFAULT_NUM_SALMON_ROUTES,
  action: AppAction,
): number => {
  if (action.type === 'SET_NUM_SALMON_ROUTES') {
    return action.payload
  }

  return state
}

// the higher the number, the more likely you'll make the returning train after
// going backwards. Negative numbers mean the train probably would've left before
// you get there
const riskinessFactor = (
  state: number = DEFAULT_RISKINESS_FACTOR,
  action: AppAction,
): number => {
  if (action.type === 'SET_RISKINESS_FACTOR') {
    return action.payload
  }

  return state
}

const numArrivals = (
  state: number = DEFAULT_NUM_ARRIVALS,
  action: AppAction,
): number => {
  if (action.type === 'SET_NUM_ARRIVALS') {
    return action.payload
  }

  return state
}

const rootReducer = combineReducers({
  origin,
  destination,
  isFetching,
  salmonRoutes,
  arrivals,
  lastUpdated,
  numSalmonRoutes,
  riskinessFactor,
  numArrivals,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
