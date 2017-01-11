// @flow
import React, {Component, PropTypes} from 'react'
import {View, Text} from 'react-native'

import styles from './SalmonRoutes.styles'

const TRAIN_PROP_TYPE = PropTypes.shape({
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

const SalmonRoute = ({route}) => {
    let {waitTime, backwardsRideTime, backwardsTrain, backwardsStation, backwardsWaitTime, returnRideTime, returnTrain} = route
    let totalTime = waitTime + backwardsRideTime + backwardsWaitTime + returnRideTime

    return (
        <View style={styles.salmonRoute}>
            <Text>{backwardsTrain.destination} train ({waitTime} min wait)</Text>
            <Text>Get off at {backwardsStation}</Text>
            <Text>{returnTrain.destination} train ({backwardsWaitTime} min wait)</Text>
            <Text>Salmon time: {totalTime}</Text>
        </View>
    )
}

export default class SalmonRoutes extends Component {
    static propTypes = {
        routes: PropTypes.arrayOf(
            PropTypes.shape({
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
        ).isRequired
    }

    render = () => {
        let {routes} = this.props

        // TODO: Salmon routes need some sort of unique identifier
        let salmonRoutes = routes.map((route, index) => (
            <SalmonRoute key={index} route={route} />
        ))

        return (
            <View accessibilityRole="main">
                {salmonRoutes}
            </View>
        )
    }
}
