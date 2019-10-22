import React, {ChangeEventHandler} from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {validateValue} from './utils'
import {SelectorValue} from './types'

import useStyles from './Selector.styles'

interface Props<SelectorValueType> {
  id: string;
  label: string;
  values: SelectorValue<SelectorValueType>[];
  value?: SelectorValueType;
  onChange?: (newValue: SelectorValueType) => void;
}


// NOTE: It's important for ValueType to extend string as it ultimately
// will be rendered out in <option>s
const Selector = <ValueType extends string = string>({
  id,
  label,
  values,
  value,
  onChange,
}: Props<ValueType>) => {
  const classes = useStyles()
  let handleChange: ChangeEventHandler<HTMLSelectElement> | undefined

  if (onChange) {
    handleChange = (e) => {
      // NOTE: because all of the values are SelectorValue objects
      // it should be safe to coerce the selected value to ValueType
      onChange(e.target.value as ValueType)
    }
  }

  const validatedValue = validateValue(values, value)
  const options = values.map(({value, display}) => (
    <option key={value} value={value}>
      {display || value}
    </option>
  ))

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <NativeSelect
        value={validatedValue}
        onChange={handleChange}
        inputProps={{name: id, id}}
      >
        {options}
      </NativeSelect>
    </FormControl>
  )
}

export default Selector
