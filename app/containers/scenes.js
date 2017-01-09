// @flow
/* eslint-disable react/jsx-max-props-per-line */
import React from 'react'
import {Actions, Scene} from 'react-native-router-flux'

import Home from './Home'
import Salmon from './Salmon'

export default Actions.create(
    <Scene key="root">
        <Scene key="home" component={Home} title="Bart Salmon" initial={true} />
        <Scene key="salmon" component={Salmon} title="Salmon Routes" />
    </Scene>
)
