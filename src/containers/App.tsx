import React from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {Router} from '@reach/router'
import configureStore from '../store'

import Layout from './Layout'
import ConnectedRoutesPage from './ConnectedRoutesPage'
import ConnectedSettingsPage from './ConnectedSettingsPage'


const {store, persistor} = configureStore()

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Layout path="/">
            <ConnectedRoutesPage path="/" default={true} />
            <ConnectedSettingsPage path="settings" />
          </Layout>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
