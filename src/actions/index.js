// @flow
import {
    getSuggestedSalmonRoutesFromEtds,
    getNextArrivalsFromEtds
} from '../utils/salmon'
import {getEstimatedTimesOfDeparture} from '../api'
import type {StationName, SalmonRoute, Train} from '../utils/flow'
import type {
    ReduxDispatch,
    ReduxAction,
    ReduxAsyncAction,
    ReduxGetState
} from '../actions/flow'

const NUM_ARRIVALS = 4

export const setNumSalmonRoutes = (numRoutes: number): ReduxAction => ({
    type: 'SET_NUM_SALMON_ROUTES',
    payload: {
        numRoutes
    }
})

export const setRiskinessFactor = (riskinessFactor: number): ReduxAction => ({
    type: 'SET_RISKINESS_FACTOR',
    payload: {
        riskinessFactor
    }
})

const fetchSalmonInfo = (): ReduxAction => ({
    type: 'FETCH_SALMON_INFO'
})

const receiveSalmonInfo = (
    routes: SalmonRoute[],
    arrivals: Train[]
): ReduxAction => ({
    type: 'RECEIVE_SALMON_INFO',
    payload: {
        routes,
        arrivals
    }
})

const errorSalmonInfo = (error: Error): ReduxAction => ({
    type: 'ERROR_SALMON_INFO',
    error
})

export const getSalmonInfo = (): ReduxAsyncAction => async (
    dispatch: ReduxDispatch,
    getState: ReduxGetState
) => {
    let {origin, destination, numSalmonRoutes, riskinessFactor} = getState()

    if (origin && destination) {
        dispatch(fetchSalmonInfo())

        try {
            let etdsLookup = await getEstimatedTimesOfDeparture()
            let salmonRoutes = getSuggestedSalmonRoutesFromEtds(
                etdsLookup,
                origin,
                destination,
                numSalmonRoutes,
                riskinessFactor
            )
            let arrivals = getNextArrivalsFromEtds(
                etdsLookup,
                origin,
                destination,
                NUM_ARRIVALS
            )

            dispatch(receiveSalmonInfo(salmonRoutes, arrivals))
        } catch (error) {
            // TODO: Create a custom Error that wraps this native error message
            // to be more friendly
            dispatch(errorSalmonInfo(error))
        }
    }
}

export const setOrigin = (name: StationName): ReduxAction => async (
    dispatch: ReduxDispatch
) => {
    dispatch({
        type: 'SET_ORIGIN',
        payload: {
            name
        }
    })
    dispatch(getSalmonInfo())
}

export const setDestination = (name: StationName): ReduxAction => async (
    dispatch: ReduxDispatch
) => {
    dispatch({
        type: 'SET_DESTINATION',
        payload: {
            name
        }
    })
    dispatch(getSalmonInfo())
}
