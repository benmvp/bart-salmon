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
            salmonRoutes: []
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
            numSalmonRoutes: 1,
            isFetchingSalmonRoutes: false,
            salmonRoutes: []
        })

        await asyncAction(mockDispatch, getState)

        expect(mockDispatch).toHaveBeenCalledTimes(2)
        expect(mockDispatch).lastCalledWith({
            type: 'RECEIVE_SALMON_INFO',
            payload: {
                routes: [
                    {
                        backwardsRideTime: 5,
                        backwardsRouteId: 'ROUTE 3',
                        backwardsStation: 'RICH',
                        backwardsTrain: {
                            abbreviation: 'RICH',
                            bikeflag: 1,
                            color: 'ORANGE',
                            destination: 'Richmond',
                            direction: 'North',
                            hexcolor: '#ff9933',
                            length: 4,
                            limited: 0,
                            minutes: 2,
                            platform: 1
                        },
                        backwardsWaitTime: 7,
                        returnRideTime: 4,
                        returnRouteId: 'ROUTE 7',
                        returnTrain: {
                            abbreviation: 'MLBR',
                            bikeflag: 1,
                            color: 'RED',
                            destination: 'Millbrae',
                            direction: 'South',
                            hexcolor: '#ff0000',
                            length: 5,
                            limited: 0,
                            minutes: 14,
                            platform: 2
                        },
                        waitTime: 2
                    }
                ]
            }
        })
    })

    it('dispatches ERROR_SALMON_INFO action', async () => {
        let mockDispatch = jest.fn()
        let asyncAction = getSalmonInfo()
        let getState = () => ({
            origin: '24TH',
            destination: '24TH',
            numSalmonRoutes: 7,
            isFetchingSalmonRoutes: false,
            salmonRoutes: []
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
