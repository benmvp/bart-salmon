// @flow
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import configureStore from '../store/configureStore'
import routes from './routes.web'

const store = configureStore()

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router routes={routes} history={browserHistory} />
            </Provider>
        )
    }
}
