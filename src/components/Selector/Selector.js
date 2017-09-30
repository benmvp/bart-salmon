import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Picker} from 'react-native'
import {validateValue} from './utils'
import {VALUES_PROP_TYPE} from './constants'

const _getItems = (values) =>
    values.map(({value, display}) => (
        <Picker.Item key={value} value={value} label={display || value} />
    ))

export default class Selector extends Component {
    static propTypes = {
        values: VALUES_PROP_TYPE.isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func
    }

    render = () => {
        let {values, value, onChange} = this.props

        value = validateValue(value, values)

        return (
            <Picker onValueChange={onChange} selectedValue={value}>
                {_getItems(values)}
            </Picker>
        )
    }
}
