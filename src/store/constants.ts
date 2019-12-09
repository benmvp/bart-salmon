import storage from 'redux-persist/lib/storage'

const REDUCERS_TO_PERSIST = [
  'origin',
  'destination',
  'riskinessFactor',
  'numSalmonRoutes',
  'numArrivals',
]

export const PERSIST_CONFIG = {
  key: 'root',
  storage,
  whitelist: REDUCERS_TO_PERSIST,
}

export const DEFAULT_NUM_SALMON_ROUTES = 4
export const DEFAULT_RISKINESS_FACTOR = 1
export const DEFAULT_NUM_ARRIVALS = 4
