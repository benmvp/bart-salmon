// @flow
import React, {Component, PropTypes} from 'react'
import {View, Text} from 'react-native'
import stationsLookup from '../data/stations.json'
import {TRAINS_PROP_TYPE} from '../containers/constants'

import styles from './Arrivals.styles'

const _displayMinutes = (minutes: number): string => (
    `${minutes} ${(minutes === 1 ? 'min' : 'mins')}`
)

const NextTrain = ({train}) => {
    if (!train) {
        return null
    }

    let {minutes} = train
    let displayTime = minutes ? minutes : 'NOW'

    return (
        <View style={styles.nextTrain}>
            <Text style={styles.nextTrainTime}>{displayTime}</Text>
        </View>
    )
}

const FollowingTrains = ({trains}) => {
    let trainComponents = trains.map(({minutes}, index) => (
        <Text key={index} style={styles.followingTrainTime}>{_displayMinutes(minutes)}</Text>
    ))

    return (
        <View style={styles.followingTrains}>
            {trainComponents}
        </View>
    )
}

export default class Arrivals extends Component {
    static propTypes = {
        destination: PropTypes.string.isRequired,
        arrivals: TRAINS_PROP_TYPE.isRequired,
    }

    render = () => {
        let {destination, arrivals} = this.props
        let [firstTrain, ...followingTrains] = arrivals
        let destinationDisplay = stationsLookup[destination].name

        return (
            <View style={styles.root}>
                <View style={styles.headingSection}>
                    <Text style={styles.heading}>Next train to</Text>
                    <Text style={styles.heading}>{destinationDisplay}</Text>
                    <Text style={styles.heading}>in</Text>
                </View>
                <NextTrain train={firstTrain} />
                <FollowingTrains trains={followingTrains} />
            </View>
        )
    }
}
