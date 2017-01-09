import React from 'react'
import {Route, IndexRoute} from 'react-router'

import Page from './Page'
import Home from './Home'

const BASE_PATH = process.env.NODE_ENV === 'production'
    ? '/bart-salmon'
    : '/'

export default (
    <Route path={BASE_PATH} component={Page}>
        <IndexRoute component={Home} />
    </Route>
)
