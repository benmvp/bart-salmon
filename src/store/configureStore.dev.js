// @flow

import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {autoRehydrate, persistStore} from 'redux-persist'
import {AsyncStorage, Platform} from 'react-native'
import {composeWithDevTools} from 'redux-devtools-extension'
import {createLogger} from 'redux-logger'
import rootReducer from '../reducers'
import {REDUCERS_TO_IGNORE} from './constants'
import {getSalmonInfo} from '../actions'
import type {ReduxStore} from './flow'
import type {ReduxState} from '../reducers/flow'

const configureStore = (preloadedState: ReduxState): ReduxStore => {
  let store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      autoRehydrate(),
      applyMiddleware(thunk, createLogger()),
    ),
  )
  let storage

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      let nextRooterReducer = require('../reducers').default

      store.replaceReducer(nextRooterReducer)
    })
  }

  if (Platform.OS !== 'web') {
    storage = AsyncStorage
  }

  persistStore(
    store,
    {
      storage,
      blacklist: REDUCERS_TO_IGNORE,
    },
    () => {
      // after rehydrating we need to get the new data
      // TODO: Ideally we'd only do this on the routes page
      store.dispatch(getSalmonInfo())
    },
  )

  return store
}

export default configureStore
