import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './containers/App'

const BASE_PATH = process.env.NODE_ENV === 'production'
    ? '/bart-salmon'
    : '/'

export default (
    <Route path={BASE_PATH} component={App}>
        <IndexRoute />
    </Route>
)
