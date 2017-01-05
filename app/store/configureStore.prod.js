import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import {ReduxState} from '../reducers/flow'

const configureStore = (preloadedState: ReduxState) => createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk)
)

export default configureStore
