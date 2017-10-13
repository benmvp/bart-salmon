// @flow
import type {Dispatch} from 'redux'
import type {ReduxState} from '../reducers/flow'

export type ReduxActionTypeSetOrigin = 'SET_ORIGIN'
export type ReduxActionTypeSetDestination = 'SET_DESTINATION'
export type ReduxActionTypeSetNumSalmonRoutes = 'SET_NUM_SALMON_ROUTES'
export type ReduxActionTypeFetchSalmonInfo = 'FETCH_SALMON_INFO'
export type ReduxActionTypeReceiveSalmonInfo = 'RECEIVE_SALMON_INFO'
export type ReduxActionTypeErrorSalmonInfo = 'ERROR_SALMON_INFO'
export type ReduxActionTypeSetRiskinessFactor = 'SET_RISKINESS_FACTOR'

export type ReduxAction = {
  type:
    | 'SET_ORIGIN'
    | 'SET_DESTINATION'
    | 'SET_NUM_SALMON_ROUTES'
    | 'FETCH_SALMON_INFO'
    | 'RECEIVE_SALMON_INFO'
    | 'ERROR_SALMON_INFO'
    | 'SET_RISKINESS_FACTOR',
  +payload?: Object,
  +error?: Error,
}

export type ReduxDispatch = Dispatch<ReduxAction>

export type ReduxGetState = () => ReduxState

export type ReduxAsyncAction = (
  dispatch: ReduxDispatch,
  getState: ReduxGetState,
) => Promise<*>
