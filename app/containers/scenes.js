// @flow
/* eslint-disable react/jsx-max-props-per-line */
import React from 'react'
import {Actions, Scene} from 'react-native-router-flux'

import Home from './Home'

export default Actions.create(
    <Scene key="root">
        <Scene key="home" component={Home} title="Bart Salmon" initial={true} />
    </Scene>
)
