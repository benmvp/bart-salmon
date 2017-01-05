// @flow

import type {Store} from 'redux'
import type {ReduxAction} from '../actions/flow'
import type {ReduxState} from '../reducers/flow'

export type ReduxStore = Store<ReduxState, ReduxAction>
