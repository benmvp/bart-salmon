// @flow
import {getSuggestedSalmonRoutes} from '../utils'
import type {StationName, SalmonRoute} from '../utils/flow'
import type {ReduxDispatch, ReduxAction, ReduxAsyncAction, ReduxGetState} from '../actions/flow'

export const setOrigin = (name: StationName): ReduxAction => ({
    type: 'SET_ORIGIN',
    payload: {
        name
    }
})

export const setDestination = (name: StationName): ReduxAction => ({
    type: 'SET_DESTINATION',
    payload: {
        name
    }
})

export const setNumSalmonRoutes = (numRoutes: number): ReduxAction => ({
    type: 'SET_NUM_SALMON_ROUTES',
    payload: {
        numRoutes
    }
})

const fetchSalmonInfo = (): ReduxAction => ({
    type: 'FETCH_SALMON_INFO'
})

const receiveSalmonInfo = (routes: SalmonRoute[]): ReduxAction => ({
    type: 'RECEIVE_SALMON_INFO',
    payload: {
        routes
    }
})

const errorSalmonInfo = (error: Error): ReduxAction => ({
    type: 'ERROR_SALMON_INFO',
    error
})

export const getSalmonInfo = (): ReduxAsyncAction => (
    async (dispatch: ReduxDispatch, getState: ReduxGetState) => {
        dispatch(fetchSalmonInfo())

        let {origin, destination, numSalmonRoutes} = getState()

        try {
            let salmonRoutes = await getSuggestedSalmonRoutes(origin, destination, numSalmonRoutes)

            dispatch(receiveSalmonInfo(salmonRoutes))
        } catch (error) {
            // TODO: Create a custom Error that wraps this native error message
            // to be more friendly
            dispatch(errorSalmonInfo(error))
        }
    }
)
