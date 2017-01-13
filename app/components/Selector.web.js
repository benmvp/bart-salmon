import React, {Component, PropTypes} from 'react'

const _getOptions = (values) => (
    values.map(({value, display}) => (
        <option key={value} value={value}>{display || value}</option>
    ))
)

const _validateValue = (valueToValidate, values) => {
    let validatedValue = valueToValidate

    let valueExists = values.find(({value}) => value === validatedValue)

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

        return (
            <select value={value} onChange={this._handleChange}>
                {_getOptions(values)}
            </select>
        )
    }
}
