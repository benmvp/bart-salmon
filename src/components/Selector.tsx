import React, {
  FC,
  ChangeEventHandler,
} from 'react'
import {findValueInfo, validateValue} from './utils'
import {SelectorValue} from './types'

import styles from './Selector.styles'

interface Props {
  values: SelectorValue[];
  value?: string;
  onChange?: (newValue: string) => void;
}

const _getOptions = (values: SelectorValue[]) =>
  values.map(({value, display}) => (
    <option key={value} value={value}>
      {display || value}
    </option>
  ))

const Selector: FC<Props> = ({
  values,
  value,
  onChange,
}) => {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const validatedValue = validateValue(values, value)
  const {display} = findValueInfo(values, validatedValue) || ({} as SelectorValue)

  return (
    <div style={styles.root}>
      <span style={styles.display}>{display}</span>
      <span style={styles.arrow}>▼</span>
      <select
        style={styles.select}
        value={validatedValue}
        onChange={handleChange}
      >
        {_getOptions(values)}
      </select>
    </div>
  )
}

export default Selector
