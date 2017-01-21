// @flow
import rootReducer from '../index'

const INITIAL_STATE = {
    origin: 'BALB',
    destination: '12TH',
    numSalmonRoutes: 5,
    isFetching: false,
    salmonRoutes: [],
    arrivals: []
}
const SAMPLE_ROUTES = [
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
const SAMPLE_ARRIVALS = [
    {
        'abbreviation': '24TH',
        'bikeflag': 1,
        'color': 'YELLOW',
        'destination': '24th Street',
        'direction': 'South',
        'hexcolor': '#ffff33',
        'length': 9,
        'limited': 0,
        'minutes': 9,
        'platform': 2,
    },
    {
        'abbreviation': 'SFIA',
        'bikeflag': 1,
        'color': 'YELLOW',
        'destination': 'SF Airport',
        'direction': 'South',
        'hexcolor': '#ffff33',
        'length': 10,
        'limited': 0,
        'minutes': 12,
        'platform': 2,
    },
    {
        'abbreviation': '24TH',
        'bikeflag': 1,
        'color': 'YELLOW',
        'destination': '24th Street',
        'direction': 'South',
        'hexcolor': '#ffff33',
        'length': 9,
        'limited': 0,
        'minutes': 20,
        'platform': 2,
    },
    {
        'abbreviation': 'SFIA',
        'bikeflag': 1,
        'color': 'YELLOW',
        'destination': 'SF Airport',
        'direction': 'South',
        'hexcolor': '#ffff33',
        'length': 10,
        'limited': 0,
        'minutes': 25,
        'platform': 2,
    },
    {
        'abbreviation': 'SFIA',
        'bikeflag': 1,
        'color': 'YELLOW',
        'destination': 'SF Airport',
        'direction': 'South',
        'hexcolor': '#ffff33',
        'length': 10,
        'limited': 0,
        'minutes': 40,
        'platform': 2,
    },
]

it('should handle SET_ORIGIN action', () => {
    let name = 'SFIA'
    let actualState = rootReducer(INITIAL_STATE, {
        type: 'SET_ORIGIN',
        payload: {name}
    })
    let expectedState = {
        ...INITIAL_STATE,
        origin: name
    }

    expect(actualState).toEqual(expectedState)
})

it('should handle SET_DESTINATION action', () => {
    let name = 'PITT'
    let actualState = rootReducer(INITIAL_STATE, {
        type: 'SET_DESTINATION',
        payload: {name}
    })
    let expectedState = {
        ...INITIAL_STATE,
        destination: name
    }

    expect(actualState).toEqual(expectedState)
})

it('should handle SET_NUM_SALMON_ROUTES action', () => {
    let numRoutes = 10
    let actualState = rootReducer(INITIAL_STATE, {
        type: 'SET_NUM_SALMON_ROUTES',
        payload: {numRoutes}
    })
    let expectedState = {
        ...INITIAL_STATE,
        numSalmonRoutes: numRoutes
    }

    expect(actualState).toEqual(expectedState)
})

it('should handle FETCH_SALMON_INFO action', () => {
    let actualState = rootReducer(INITIAL_STATE, {type: 'FETCH_SALMON_INFO'})
    let expectedState = {
        ...INITIAL_STATE,
        isFetching: true
    }

    expect(actualState).toEqual(expectedState)
})

it('should handle RECEIVE_SALMON_INFO action', () => {
    let routes = SAMPLE_ROUTES
    let arrivals = SAMPLE_ARRIVALS
    let actualState = rootReducer(
        {
            ...INITIAL_STATE,
            isFetching: true
        },
        {
            type: 'RECEIVE_SALMON_INFO',
            payload: {routes, arrivals}
        }
    )
    let expectedState = {
        ...INITIAL_STATE,
        arrivals,
        salmonRoutes: routes,
        isFetching: false
    }

    expect(actualState).toEqual(expectedState)
})

it('should handle ERROR_SALMON_INFO action', () => {
    let actualState = rootReducer(
        {
            ...INITIAL_STATE,
            isFetching: true
        },
        {
            type: 'ERROR_SALMON_INFO',
            error: new Error('test error')
        }
    )
    let expectedState = {
        ...INITIAL_STATE,
        salmonRoutes: [],
        arrivals: [],
        isFetching: false
    }

    expect(actualState).toEqual(expectedState)
})
