import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './containers/App'

export default (
    <Route path="/" component={App}>
        <IndexRoute component={App} />
        <Route path="foo" component={App} />
    </Route>
)
