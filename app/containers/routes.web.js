import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {getBasePath} from '../utils/routing'

import Page from './Page'
import Home from './Home'
import Salmon from './Salmon'

const BASE_PATH = getBasePath()

export default (
    <Route path={BASE_PATH} component={Page}>
        <IndexRoute component={Home} />
        <Route path="salmon" component={Salmon} />
    </Route>
)
