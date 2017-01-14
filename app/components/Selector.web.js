import React, {Component, PropTypes} from 'react'

import styles from './Selector.styles'

const _getOptions = (values) => (
    values.map(({value, display}) => (
        <option key={value} value={value}>{display || value}</option>
    ))
)

const _findValueInfo = (valueToFind, values) => (
    values.find(({value}) => value === valueToFind)
)

const _validateValue = (valueToValidate, values) => {
    let validatedValue = valueToValidate

    let valueExists = _findValueInfo(validatedValue, values)

    if (!valueExists && values.length) {
        validatedValue = values[0].value
    }

    return validatedValue
}

export default class Selector extends Component {
    static propTypes = {
        values: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string.isRequired,
                display: PropTypes.string
            })
        ).isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func
    }

    _handleChange = (e) => {
        let {onChange} = this.props

        if (onChange) {
            onChange(e.target.value)
        }
    }

    render = () => {
        let {values, value} = this.props

        value = _validateValue(value, values)

        let {display} = _findValueInfo(value, values)

        return (
            <div style={styles.root}>
                <span style={styles.display}>{display}</span>
                <span style={styles.arrow}>▼</span>
                <select style={styles.select} value={value} onChange={this._handleChange}>
                    {_getOptions(values)}
                </select>
            </div>
        )
    }
}
