import React, {Component, PropTypes} from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import {getSalmonInfo} from '../actions'
import Arrivals from '../components/Arrivals'
import SalmonRoutes from '../components/SalmonRoutes'
import {SALMON_ROUTES_PROP_TYPE, TRAINS_PROP_TYPE} from './constants'

import styles from './RoutesPage.styles'

class Salmon extends Component {
    static propTypes = {
        destination: PropTypes.string.isRequired,
        salmonRoutes: SALMON_ROUTES_PROP_TYPE.isRequired,
        arrivals: TRAINS_PROP_TYPE.isRequired,
        dispatchGetSalmonInfo: PropTypes.func.isRequired,
        isDisabled: PropTypes.bool
    }

    static defaultProps = {
        isDisabled: false
    }

    componentDidMount = () => {
        this.props.dispatchGetSalmonInfo()
    }

    render = () => {
        let {destination, salmonRoutes, arrivals} = this.props
        let [nextTrain] = arrivals

        return (
            <View style={styles.root}>
                <View style={styles.arrivals}>
                    <Arrivals destination={destination} arrivals={arrivals} />
                </View>
                <View style={styles.salmonRoutes}>
                    <SalmonRoutes routes={salmonRoutes} nextTrain={nextTrain} />
                </View>
            </View>

        )
    }
}

const _mapStateToProps = ({destination, salmonRoutes, arrivals, isFetchingSalmonRoutes}) => ({
    destination,
    salmonRoutes,
    arrivals,
    isDisabled: isFetchingSalmonRoutes
})

const _mapDispatchToProps = {
    dispatchGetSalmonInfo: getSalmonInfo
}

export default connect(_mapStateToProps, _mapDispatchToProps)(Salmon)
