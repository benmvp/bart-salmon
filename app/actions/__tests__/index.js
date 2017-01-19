// @flow
import {setOrigin, setDestination, setNumSalmonRoutes, getSalmonInfo} from '../'

jest.mock('../../api')

describe('setOrigin', () => {
    it('returns SET_ORIGIN action w/ specified station', () => {
        let name = 'WDUB'
        let action = setOrigin(name)

        expect(action).toEqual({
            type: 'SET_ORIGIN',
            payload: {name}
        })
    })
})

describe('setDestination', () => {
    it('returns SET_DESTINATION action w/ specified station', () => {
        let name = 'NCON'
        let action = setDestination(name)

        expect(action).toEqual({
            type: 'SET_DESTINATION',
            payload: {name}
        })
    })
})

describe('setNumSalmonRoutes', () => {
    it('returns SET_NUM_SALMON_ROUTES action w/ specified amount', () => {
        let numRoutes = 19
        let action = setNumSalmonRoutes(numRoutes)

        expect(action).toEqual({
            type: 'SET_NUM_SALMON_ROUTES',
            payload: {numRoutes}
        })
    })
})

describe('getSalmonInfo', () => {
    it('dispatches FETCH_SALMON_INFO action', async () => {
        let mockDispatch = jest.fn()
        let asyncAction = getSalmonInfo()
        let getState = () => ({
            origin: '24TH',
            destination: 'RICH',
            numSalmonRoutes: 7,
            isFetchingSalmonRoutes: false,
            salmonRoutes: [],
            arrivals: []
        })

        await asyncAction(mockDispatch, getState)

        expect(mockDispatch).toHaveBeenCalledTimes(2)
        expect(mockDispatch).toHaveBeenCalledWith({type: 'FETCH_SALMON_INFO'})
    })

    it('dispatches RECEIVE_SALMON_INFO action', async () => {
        let mockDispatch = jest.fn()
        let asyncAction = getSalmonInfo()
        let getState = () => ({
            origin: 'DELN',
            destination: 'EMBR',
            numSalmonRoutes: 3,
            isFetchingSalmonRoutes: false,
            salmonRoutes: [],
            arrivals: []
        })

        await asyncAction(mockDispatch, getState)

        expect(mockDispatch).toHaveBeenCalledTimes(2)

        let actualReceiveActionType = mockDispatch.mock.calls[1][0]

        expect(actualReceiveActionType).toMatchSnapshot()
    })

    it('dispatches ERROR_SALMON_INFO action', async () => {
        let mockDispatch = jest.fn()
        let asyncAction = getSalmonInfo()
        let getState = () => ({
            origin: '24TH',
            destination: '24TH',
            numSalmonRoutes: 7,
            isFetchingSalmonRoutes: false,
            salmonRoutes: [],
            arrivals: []
        })

        await asyncAction(mockDispatch, getState)

        expect(mockDispatch).toHaveBeenCalledTimes(2)

        let actualErrorActionType = mockDispatch.mock.calls[1][0]

        expect(actualErrorActionType).toEqual({
            type: 'ERROR_SALMON_INFO',
            error: expect.any(Error)
        })
    })
})
