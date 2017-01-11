import React, {Component} from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import {setOrigin, setDestination, getSalmonInfo} from '../actions'
import Header from '../components/salmon/Header'
import SalmonRoutes from '../components/salmon/SalmonRoutes'

import styles from './Salmon.styles'

class Salmon extends Component {
    componentDidMount = () => {
        this.props.dispatchGetSalmonInfo()
    }

    _handleStationChange = (stationUpdater, newStation) => {
        let {dispatchGetSalmonInfo} = this.props

        stationUpdater(newStation)
        dispatchGetSalmonInfo()
    }

    render = () => {
        let {origin, destination, salmonRoutes, dispatchSetOrigin, dispatchSetDestination} = this.props

        return (
            <View>
                <Header
                    origin={origin}
                    destination={destination}
                    onOriginChange={this._handleStationChange.bind(this, dispatchSetOrigin)}
                    onDestinationChange={this._handleStationChange.bind(this, dispatchSetDestination)}
                />

                <View style={styles.divider} />

                <SalmonRoutes routes={salmonRoutes} />
            </View>

        )
    }
}

const _mapStateToProps = ({origin, destination, salmonRoutes, isFetchingSalmonRoutes}) => ({
    origin,
    destination,
    salmonRoutes,
    isDisabled: isFetchingSalmonRoutes
})

const _mapDispatchToProps = {
    dispatchSetOrigin: setOrigin,
    dispatchSetDestination: setDestination,
    dispatchGetSalmonInfo: getSalmonInfo
}

export default connect(_mapStateToProps, _mapDispatchToProps)(Salmon)
