// @flow

import {combineReducers} from 'redux'
import type {SalmonRoute, StationName, Train} from '../utils/flow'
import type {ReduxAction} from '../actions/flow'

const DEFAULT_NUM_SALMON_ROUTES = 4
const DEFAULT_RISKINESS_FACTOR = 0

const origin = (state: ?StationName = null, {type, payload}: ReduxAction): ?StationName => {
    let newState = state

    if (type === 'SET_ORIGIN' && payload) {
        newState = payload.name
    }

    return newState
}

const destination = (state: ?StationName = null, {type, payload}: ReduxAction): ?StationName => {
    let newState = state

    if (type === 'SET_DESTINATION' && payload) {
        newState = payload.name
    }

    return newState
}

const isFetching = (state: boolean = false, {type}: ReduxAction): boolean => {
    let newState = state

    if (type === 'FETCH_SALMON_INFO') {
        newState = true
    } else if (type === 'RECEIVE_SALMON_INFO' || type === 'ERROR_SALMON_INFO') {
        newState = false
    }

    return newState
}

const salmonRoutes = (state: SalmonRoute[] = [], {type, payload}: ReduxAction): SalmonRoute[] => {
    let newState = state

    if (type === 'RECEIVE_SALMON_INFO' && payload) {
        newState = payload.routes
    } else if (type === 'ERROR_SALMON_INFO') {
        newState = []
    }

    return newState
}

const arrivals = (state: Train[] = [], {type, payload}: ReduxAction): Train[] => {
    let newState = state

    if (type === 'RECEIVE_SALMON_INFO' && payload) {
        newState = payload.arrivals
    } else if (type === 'ERROR_SALMON_INFO') {
        newState = []
    }

    return newState
}

const numSalmonRoutes = (state: number = DEFAULT_NUM_SALMON_ROUTES, {type, payload}: ReduxAction): number => {
    let newState = state

    if (type === 'SET_NUM_SALMON_ROUTES' && payload) {
        newState = payload.numRoutes
    }

    return newState
}

// the higher the number, the more likely you'll make the returning train after
// going backwards. Negative numbers mean the train probably would've left before
// you get there
const riskinessFactor = (state: number = DEFAULT_RISKINESS_FACTOR, {type, payload}: ReduxAction): number => {
    let newState = state

    if (type === 'SET_RISKINESS_FACTOR' && payload) {
        newState = payload.riskinessFactor
    }

    return newState
}

const rootReducer = combineReducers({
    origin,
    destination,
    isFetching,
    salmonRoutes,
    arrivals,
    numSalmonRoutes,
    riskinessFactor
})

export default rootReducer
