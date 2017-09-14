import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findValueInfo, validateValue} from './utils';
import {VALUES_PROP_TYPE} from './constants';

import styles from './Selector.styles.web';

const _getOptions = values =>
  values.map(({value, display}) => (
    <option key={value} value={value}>
      {display || value}
    </option>
  ));

export default class Selector extends Component {
  static propTypes = {
    values: VALUES_PROP_TYPE.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  _handleChange = e => {
    let {onChange} = this.props;

    if (onChange) {
      onChange(e.target.value);
    }
  };

  render = () => {
    let {values, value} = this.props;

    value = validateValue(value, values);

    let {display} = findValueInfo(value, values);

    return (
      <div style={styles.root}>
        <span style={styles.display}>{display}</span>
        <span style={styles.arrow}>▼</span>
        <select
          style={styles.select}
          value={value}
          onChange={this._handleChange}
        >
          {_getOptions(values)}
        </select>
      </div>
    );
  };
}
