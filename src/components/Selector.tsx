import React, {ChangeEventHandler} from 'react'
import {findValueInfo, validateValue} from './utils'
import {SelectorValue} from './types'

import styles from './Selector.styles'

interface Props<SelectorValueType> {
  values: SelectorValue<SelectorValueType>[];
  value?: SelectorValueType;
  onChange?: (newValue: SelectorValueType) => void;
}
  

// NOTE: It's important for ValueType to extend string as it ultimately
// will be rendered out in <option>s
const Selector = <ValueType extends string = string>({
  values,
  value,
  onChange,
}: Props<ValueType>) => {
  let handleChange: ChangeEventHandler<HTMLSelectElement> | undefined
  
  if (onChange) {
    handleChange = (e) => {
      // NOTE: because all of the values are SelectorValue objects
      // it should be safe to coerce the selected value to ValueType
      onChange(e.target.value as ValueType)
    }
  }

  const validatedValue = validateValue(values, value)
  const {display} = findValueInfo(values, validatedValue) || ({} as SelectorValue<ValueType>)
  const options = values.map(({value, display}) => (
    <option key={value} value={value}>
      {display || value}
    </option>
  ))

  return (
    <div style={styles.root}>
      <span style={styles.display}>{display}</span>
      <span style={styles.arrow}>▼</span>
      <select
        style={styles.select}
        value={validatedValue}
        onChange={handleChange}
      >
        {options}
      </select>
    </div>
  )
}

export default Selector
