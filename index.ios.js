import React from 'react'
import {AppRegistry} from 'react-native'
import {Provider} from 'react-redux'
import App from './app/containers/App'
import configureStore from './app/store/configureStore'

const store = configureStore()

const BartSalmon = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent('BartSalmon', () => BartSalmon)
