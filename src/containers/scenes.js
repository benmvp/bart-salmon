// @flow
/* eslint-disable react/jsx-max-props-per-line */
import React from 'react'
import {Actions, Scene} from 'react-native-router-flux'

import HomePage from './HomePage'
import RoutesPage from './RoutesPage'

export default Actions.create(
  <Scene key="root">
    <Scene key="home" component={HomePage} title="Bart Salmon" initial={true} />
    <Scene key="routes" component={RoutesPage} title="Salmon Routes" />
  </Scene>,
)
