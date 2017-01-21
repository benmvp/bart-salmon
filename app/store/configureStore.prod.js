// @flow

import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {autoRehydrate, persistStore} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import rootReducer from '../reducers'
import {REDUCERS_TO_IGNORE} from './constants'
import {getSalmonInfo} from '../actions'
import type {ReduxState} from '../reducers/flow'

const configureStore = (preloadedState: ReduxState) => {
    let store = createStore(
        rootReducer,
        preloadedState,
        compose(
            autoRehydrate(),
            applyMiddleware(thunk)
        )
    )

    persistStore(
        store,
        {
            storage: AsyncStorage,
            blacklist: REDUCERS_TO_IGNORE
        },
        () => {
            // after rehydrating we need to get the new data
            // TODO: Ideally we'd only do this on the routes page
            store.dispatch(getSalmonInfo())
        }
    )

    return store
}

export default configureStore
