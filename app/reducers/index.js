// @flow

import {combineReducers} from 'redux'
import type {SalmonRoute, StationName, Train} from '../utils/flow'
import type {ReduxAction} from '../actions/flow'

const DEFAULT_ORIGIN_STATION = 'POWL'
const DEFAULT_DESTINATION_STATION = 'PITT'
const DEFAULT_NUM_SALMON_ROUTES = 4


const origin = (state: StationName = DEFAULT_ORIGIN_STATION, {type, payload}: ReduxAction): StationName => {
    let newState = state

    if (type === 'SET_ORIGIN' && payload) {
        newState = payload.name
    }

    return newState
}

const destination = (state: StationName = DEFAULT_DESTINATION_STATION, {type, payload}: ReduxAction): StationName => {
    let newState = state

    if (type === 'SET_DESTINATION' && payload) {
        newState = payload.name
    }

    return newState
}

const isFetchingSalmonRoutes = (state: boolean = false, {type}: ReduxAction): boolean => {
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

const rootReducer = combineReducers({
    origin,
    destination,
    isFetchingSalmonRoutes,
    salmonRoutes,
    arrivals,
    numSalmonRoutes
})

export default rootReducer
