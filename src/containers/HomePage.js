// @flow
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {setOrigin, setDestination} from '../actions'
import {gotoRoute} from '../utils/routing'
import Selector from '../components/Selector/Selector'
import stationsLookup from '../data/stations.json'

import styles from './HomePage.styles'

const STATIONS_SELECTOR_VALUES = Object.values(
  stationsLookup,
).map(({name, abbr}) => ({value: abbr, display: name}))

const StationSelector = ({label, station, onChange}) => {
  let selectorValues = [
    {value: '', display: label},
    ...STATIONS_SELECTOR_VALUES,
  ]

  return (
    <Selector values={selectorValues} value={station} onChange={onChange} />
  )
}

class HomePage extends Component {
  static propTypes = {
    dispatchSetOrigin: PropTypes.func.isRequired,
    dispatchSetDestination: PropTypes.func.isRequired,
    origin: PropTypes.string,
    destination: PropTypes.string,
  }

  render = () => {
    let {
      origin,
      destination,
      dispatchSetOrigin,
      dispatchSetDestination,
    } = this.props
    let swimButton

    if (origin && destination) {
      swimButton = (
        <TouchableHighlight
          style={styles.swimButton}
          underlayColor="#ddd"
          onPress={gotoRoute.bind(null, 'routes')}
        >
          <Text style={styles.swimButtonText}>SWIM</Text>
        </TouchableHighlight>
      )
    }

    return (
      <View style={styles.root}>
        <View accessibilityRole="section" style={styles.selectorsShell}>
          <StationSelector
            label="ORIGIN"
            station={origin}
            onChange={dispatchSetOrigin}
          />
          <StationSelector
            label="DESTINATION"
            station={destination}
            onChange={dispatchSetDestination}
          />
        </View>

        {swimButton}
      </View>
    )
  }
}

const _mapStateToProps = ({origin, destination}) => ({
  origin,
  destination,
})

const _mapDispatchToProps = {
  dispatchSetOrigin: setOrigin,
  dispatchSetDestination: setDestination,
}

export default connect(_mapStateToProps, _mapDispatchToProps)(HomePage)
