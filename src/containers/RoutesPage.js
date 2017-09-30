import React, {Component} from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {View} from 'react-native'
import {connect} from 'react-redux'
import {setOrigin, setDestination, getSalmonInfo} from '../actions'
import Aux from '../components/Aux'
import Arrivals from '../components/Arrivals/Arrivals'
import SalmonRoutes from '../components/SalmonRoutes/SalmonRoutes'
import Selector from '../components/Selector/Selector'
import {SALMON_ROUTES_PROP_TYPE, TRAINS_PROP_TYPE} from './constants'
import STATIONS_LOOKUP from '../data/stations.json'

import styles from './RoutesPage.styles'

const STATIONS_SELECTOR_VALUES = Object.values(
    STATIONS_LOOKUP
).map(({name, abbr}) => ({value: abbr, display: name}))

const StationSelector = ({label, station, onChange}) => {
    let selectorValues = [
        {value: '', display: label},
        ...STATIONS_SELECTOR_VALUES
    ]

    return (
        <Selector values={selectorValues} value={station} onChange={onChange} />
    )
}

class RoutesPage extends Component {
    static propTypes = {
        salmonRoutes: SALMON_ROUTES_PROP_TYPE.isRequired,
        arrivals: TRAINS_PROP_TYPE.isRequired,
        dispatchSetOrigin: PropTypes.func.isRequired,
        dispatchSetDestination: PropTypes.func.isRequired,
        dispatchGetSalmonInfo: PropTypes.func.isRequired,
        origin: PropTypes.string,
        destination: PropTypes.string,
        isDisabled: PropTypes.bool
    }

    static defaultProps = {
        isDisabled: false
    }

    componentDidMount = () => {
        this.props.dispatchGetSalmonInfo()
    }

    render = () => {
        let {
            origin,
            destination,
            dispatchSetOrigin,
            dispatchSetDestination,
            salmonRoutes,
            arrivals
        } = this.props
        let arrivalsAndRoutes

        if (!isEmpty(arrivals)) {
            let [nextTrain] = arrivals

            arrivalsAndRoutes = (
                <Aux>
                    <View style={styles.arrivals}>
                        <Arrivals
                            destination={destination}
                            arrivals={arrivals}
                        />
                    </View>
                    <View style={styles.salmonRoutes}>
                        <SalmonRoutes
                            routes={salmonRoutes}
                            nextTrain={nextTrain}
                        />
                    </View>
                </Aux>
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
                {arrivalsAndRoutes}
            </View>
        )
    }
}

const _mapStateToProps = ({
    origin,
    destination,
    salmonRoutes,
    arrivals,
    isFetching
}) => ({
    origin,
    destination,
    salmonRoutes,
    arrivals,
    isDisabled: isFetching
})

const _mapDispatchToProps = {
    dispatchSetOrigin: setOrigin,
    dispatchSetDestination: setDestination,
    dispatchGetSalmonInfo: getSalmonInfo
}

export default connect(_mapStateToProps, _mapDispatchToProps)(RoutesPage)
