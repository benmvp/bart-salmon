import storage from 'redux-persist/lib/storage'

// NOTE: When we add UI elements for riskinessFactor & numSalmonRoutes
// we can add them to the list of state to persist
const REDUCERS_TO_PERSIST = ['origin', 'destination']

export const PERSIST_CONFIG = {
  key: 'root',
  storage,
  whitelist: REDUCERS_TO_PERSIST,
}

export const DEFAULT_NUM_SALMON_ROUTES = 4
export const DEFAULT_RISKINESS_FACTOR = 0
export const DEFAULT_NUM_ARRIVALS = 4
