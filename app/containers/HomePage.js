// @flow
import React, {Component, PropTypes} from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {setOrigin, setDestination} from '../actions'
import {gotoRoute} from '../utils/routing'
import Selector from '../components/Selector'
import stationsLookup from '../data/stations.json'

import styles from './HomePage.styles'

const STATIONS_SELECTOR_VALUES = Object.values(stationsLookup)
    .map(({name, abbr}) => ({value: abbr, display: name}))

const StationSelector = ({station, onChange}) => (
    <Selector
        values={STATIONS_SELECTOR_VALUES}
        value={station}
        onChange={onChange}
    />
)

class HomePage extends Component {
    static propTypes = {
        origin: PropTypes.string.isRequired,
        destination: PropTypes.string.isRequired,
        dispatchSetOrigin: PropTypes.func.isRequired,
        dispatchSetDestination: PropTypes.func.isRequired
    }

    render = () => {
        let {origin, destination, dispatchSetOrigin, dispatchSetDestination} = this.props

        return (
            <View style={styles.root}>
                <View accessibilityRole="section" style={styles.selectorsShell}>
                    <Text accessibilityRole="label" style={styles.label}>Origin</Text>
                    <StationSelector station={origin} onChange={dispatchSetOrigin} />
                    <Text accessibilityRole="label" style={[styles.label, styles.labelWithMargin]}>Destination</Text>
                    <StationSelector station={destination} onChange={dispatchSetDestination} />
                </View>

                <TouchableHighlight style={styles.swimButton} underlayColor="#ddd" onPress={gotoRoute.bind(null, 'routes')}>
                    <Text style={styles.swimButtonText}>SWIM</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const _mapStateToProps = ({origin, destination}) => ({
    origin,
    destination
})

const _mapDispatchToProps = {
    dispatchSetOrigin: setOrigin,
    dispatchSetDestination: setDestination
}

export default connect(_mapStateToProps, _mapDispatchToProps)(HomePage)
