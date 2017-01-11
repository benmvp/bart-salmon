import React, {Component, PropTypes} from 'react'
import {View, Text} from 'react-native'
import Selector from '../common/Selector'
import stationsLookup from '../../data/stations.json'

// import styles from './Header.styles'

const STATIONS_SELECTOR_VALUES = Object.values(stationsLookup)
    .map(({name, abbr}) => ({value: abbr, display: name}))

const StationSelector = ({station, onChange}) => (
    <Selector
        values={STATIONS_SELECTOR_VALUES}
        value={station}
        onChange={onChange}
    />
)

export default class Header extends Component {
    static propTypes = {
        origin: PropTypes.string.isRequired,
        destination: PropTypes.string.isRequired,
        onOriginChange: PropTypes.func.isRequired,
        onDestinationChange: PropTypes.func.isRequired
    }

    render = () => {
        let {origin, destination, onOriginChange, onDestinationChange} = this.props

        return (
            <View accessibilityRole="header">
                <Text>Origin</Text>
                <StationSelector station={origin} onChange={onOriginChange} />
                <Text>Destination</Text>
                <StationSelector station={destination} onChange={onDestinationChange} />
            </View>
        )
    }
}
