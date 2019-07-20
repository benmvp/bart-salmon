import storage from 'redux-persist/lib/storage' 

import {AppState} from './reducers'
import {AppAction} from './types'

const REDUCERS_NOT_TO_PERSIST = ['salmonRoutes', 'arrivals', 'isFetching']

export const PERSIST_CONFIG = {
  key: 'root',
  storage,
  blacklist: REDUCERS_NOT_TO_PERSIST,
}

export type AppStore = Store<AppState, AppAction>
