import {PropTypes} from 'react'

export const TRAIN_PROP_TYPE = PropTypes.shape({
    destination: PropTypes.string,
    abbreviation: PropTypes.string,
    limited: PropTypes.number,
    minutes: PropTypes.number,
    platform: PropTypes.number,
    direction: PropTypes.string,
    length: PropTypes.number,
    color: PropTypes.string,
    hexcolor: PropTypes.string,
    bikeflag: PropTypes.number
})

export const TRAINS_PROP_TYPE = PropTypes.arrayOf(TRAIN_PROP_TYPE)

export const SALMON_ROUTE_PROP_TYPE = PropTypes.shape({
    waitTime: PropTypes.number,

    backwardsTrain: TRAIN_PROP_TYPE,
    backwardsRouteId: PropTypes.string,
    backwardsStation: PropTypes.string,
    backwardsRideTime: PropTypes.number,
    backwardsRideNumStations: PropTypes.number,
    backwardsWaitTime: PropTypes.number,

    returnTrain: TRAIN_PROP_TYPE,
    returnRouteId: PropTypes.string,
    returnRideTime: PropTypes.number
})

export const SALMON_ROUTES_PROP_TYPE = PropTypes.arrayOf(SALMON_ROUTE_PROP_TYPE)
