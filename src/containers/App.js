// @flow
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import configureStore from '../store/configureStore'

import RoutesPage from './RoutesPage'

const store = configureStore()

export default class App extends Component {
    render = () => (
        <Provider store={store}>
            <RoutesPage />
        </Provider>
    )
}
