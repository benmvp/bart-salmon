import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {getSalmonInfo} from '../actions';
import Arrivals from '../components/Arrivals/Arrivals';
import SalmonRoutes from '../components/SalmonRoutes/SalmonRoutes';
import {SALMON_ROUTES_PROP_TYPE, TRAINS_PROP_TYPE} from './constants';

import styles from './RoutesPage.styles';

class RoutesPage extends Component {
  static propTypes = {
    salmonRoutes: SALMON_ROUTES_PROP_TYPE.isRequired,
    arrivals: TRAINS_PROP_TYPE.isRequired,
    dispatchGetSalmonInfo: PropTypes.func.isRequired,
    destination: PropTypes.string,
    isDisabled: PropTypes.bool
  };

  static defaultProps = {
    isDisabled: false
  };

  componentDidMount = () => {
    this.props.dispatchGetSalmonInfo();
  };

  render = () => {
    let {destination, salmonRoutes, arrivals} = this.props;

    // TODO: Need a better fallback for when there's nothing to display
    if (isEmpty(arrivals)) {
      return null;
    }

    let [nextTrain] = arrivals;

    return (
      <View style={styles.root}>
        <View style={styles.arrivals}>
          <Arrivals destination={destination} arrivals={arrivals} />
        </View>
        <View style={styles.salmonRoutes}>
          <SalmonRoutes routes={salmonRoutes} nextTrain={nextTrain} />
        </View>
      </View>
    );
  };
}

const _mapStateToProps = ({
  destination,
  salmonRoutes,
  arrivals,
  isFetching
}) => ({
  destination,
  salmonRoutes,
  arrivals,
  isDisabled: isFetching
});

const _mapDispatchToProps = {
  dispatchGetSalmonInfo: getSalmonInfo
};

export default connect(_mapStateToProps, _mapDispatchToProps)(RoutesPage);
