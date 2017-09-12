import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {getBasePath} from '../utils/routing'

import PageStructure from './PageStructure'
import HomePage from './HomePage'
import RoutesPage from './RoutesPage'

const BASE_PATH = getBasePath()

export default (
    <Route path={BASE_PATH} component={PageStructure}>
        <IndexRoute component={HomePage} />
        <Route path="routes" component={RoutesPage} />
    </Route>
)
