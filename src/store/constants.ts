import storage from 'redux-persist/lib/storage'

// NOTE: When we add UI elements for riskinessFactor & numSalmonRoutes
// we can add them to the list of state to persist
const REDUCERS_TO_PERSIST = ['origin', 'destination']

export const PERSIST_CONFIG = {
  key: 'root',
  storage,
  whitelist: REDUCERS_TO_PERSIST,
}
