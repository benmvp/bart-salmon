import { createStore, applyMiddleware } from 'redux'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import rootReducer, { AppState } from './reducers'
import { PERSIST_CONFIG } from './constants'
import { AppAction } from './types'


const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer)

const configureStore = (preloadedState?: AppState) => {
  const middleware = [
    thunk as ThunkMiddleware<AppState, AppAction>,
  ]

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')

    middleware.push(logger)
  }

  const composeEnhancers = composeWithDevTools({
    trace: true,
  })
  const store = createStore(
    persistedReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  )
  const persistor = persistStore(store)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      // This fetch the new state of the above root reducer
      const nextRootReducer = require('./reducers').default

      store.replaceReducer(
        persistReducer(PERSIST_CONFIG, nextRootReducer)
      )
    })
  }

  return { store, persistor }
}

export default configureStore
