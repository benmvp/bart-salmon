// @flow
import React, {Component} from 'react'
import {View, Text} from 'react-native'
import stationsLookup from '../data/stations.json'
import {getSalmonTimeFromRoute} from '../utils/salmon'
import {SALMON_ROUTES_PROP_TYPE, TRAIN_PROP_TYPE} from '../containers/constants'

import styles from './SalmonRoutes.styles'

const SalmonRoute = ({route, nextTrain}) => {
    let {waitTime, backwardsTrain, backwardsStation, backwardsWaitTime, returnTrain} = route
    let salmonTime = getSalmonTimeFromRoute(route)
    let salmonTimeAdditionalTime = salmonTime
    let backwardsStationInfo = stationsLookup[backwardsStation]
    let backwardsStationName = backwardsStationInfo.name

    if (nextTrain) {
        salmonTimeAdditionalTime -= nextTrain.minutes
    }

    let minutesLabel = salmonTimeAdditionalTime === 1 ? 'minute' : 'minutes'

    return (
        <View style={styles.salmonRoute}>
            <Text style={styles.station}>{backwardsStationName}</Text>
            <View style={styles.route}>
                <Text style={styles.routeDir}>{backwardsTrain.abbreviation} in {waitTime}</Text>
                <View style={styles.routeDivider} />
                <Text style={styles.routeDir}>{backwardsWaitTime} for {returnTrain.abbreviation}</Text>
            </View>
            <View style={styles.time}>
                <Text style={styles.timeValue}>⁺{salmonTimeAdditionalTime}</Text>
                <Text style={styles.timeLabel}>{minutesLabel}</Text>
            </View>
        </View>
    )
}

const Header = () => (
    <View accessibilityRole="header" style={styles.header}>
        <Text style={styles.headerStation}>Swim To</Text>
        <Text style={styles.headerRoute}>Route</Text>
        <Text style={styles.headerTime}>Add</Text>
    </View>
)

export default class SalmonRoutes extends Component {
    static propTypes = {
        routes: SALMON_ROUTES_PROP_TYPE.isRequired,
        nextTrain: TRAIN_PROP_TYPE
    }

    render = () => {
        let {routes, nextTrain} = this.props

        // TODO: Salmon routes need some sort of unique identifier
        let salmonRoutes = routes.map((route, index) => (
            <SalmonRoute key={index} route={route} nextTrain={nextTrain} />
        ))

        return (
            <View accessibilityRole="main">
                <Header />
                {salmonRoutes}
            </View>
        )
    }
}
