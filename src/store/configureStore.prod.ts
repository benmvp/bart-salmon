import {createStore, applyMiddleware} from 'redux'
import thunk, {ThunkMiddleware} from 'redux-thunk'
import {persistStore, persistReducer} from 'redux-persist'

import rootReducer, {AppState} from './reducers'
import {PERSIST_CONFIG} from './constants'
import {AppAction} from './types'
import {getSalmonInfo} from './actions'


const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer)

const configureStore = (preloadedState: AppState) => {
  const store = createStore(
    persistedReducer,
    preloadedState,
    applyMiddleware(thunk as ThunkMiddleware<AppState, AppAction>),
  )
  const persistor = persistStore(
    store,
    undefined,
    () => {
      // after rehydrating we need to get the new data
      // TODO: Ideally we'd only do this on the routes page
      store.dispatch(getSalmonInfo())
    },
  )

  return {store, persistor}
}

export default configureStore
