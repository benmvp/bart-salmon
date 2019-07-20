import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {persistStore, persistReducer} from 'redux-persist'
import {composeWithDevTools} from 'redux-devtools-extension'
import {createLogger} from 'redux-logger'

import rootReducer, {AppState} from './reducers'
import {PERSIST_CONFIG, AppStore} from './constants'
import {getSalmonInfo} from './actions'


const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer)

const configureStore = (preloadedState: AppState): AppStore => {
  let store = createStore(
    persistedReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(thunk, createLogger()),
    ),
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      // const nextPersistedReducer = persistReducer(PERSIST_CONFIG, nextRootReducer)

      store.replaceReducer(nextRootReducer)
    })
  }

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
