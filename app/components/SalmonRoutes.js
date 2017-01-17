// @flow
import React, {Component, PropTypes} from 'react'
import {View, Text} from 'react-native'
import stationsLookup from '../data/stations.json'
import {getSalmonTimeFromRoute} from '../utils'

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
    let {waitTime, backwardsTrain, backwardsStation, backwardsWaitTime, returnTrain} = route
    let salmonTime = getSalmonTimeFromRoute(route)
    let backwardsStationInfo = stationsLookup[backwardsStation]
    let backwardsStationName = backwardsStationInfo.nickname || backwardsStationInfo.name

    return (
        <View style={styles.salmonRoute}>
            <Text style={styles.station}>{backwardsStationName}</Text>
            <View style={styles.route}>
                <Text style={styles.routeDir}>{backwardsTrain.abbreviation} in {waitTime}</Text>
                <Text style={styles.routeDir}>{backwardsWaitTime} for {returnTrain.abbreviation}</Text>
            </View>
            <View style={styles.time}>
                <Text style={styles.timeValue}>{salmonTime}</Text>
                <Text style={styles.timeLabel}>minutes</Text>
            </View>
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
