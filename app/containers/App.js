// @flow
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router} from 'react-native-router-flux'
import configureStore from '../store/configureStore'
import scenes from './scenes'

const store = configureStore()

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router scenes={scenes} />
            </Provider>
        )
    }
}
