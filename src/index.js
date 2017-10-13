// @flow
import React from 'react'
import {render} from 'react-dom'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

import './index.css'

render(<App />, document.getElementById('root'))
// render(<div>Hello world!</div>, document.getElementById('root'));

registerServiceWorker()
