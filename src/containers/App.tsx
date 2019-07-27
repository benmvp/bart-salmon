import React, {FunctionComponent} from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
// import {Router, browserHistory} from 'react-router'
import configureStore from '../store'
// import routes from './routes'

import ConnectedRoutesPage from './ConnectedRoutesPage'


const {store, persistor} = configureStore()

const App: FunctionComponent<{}> = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRoutesPage />
    </PersistGate>
  </Provider>
)

export default App
