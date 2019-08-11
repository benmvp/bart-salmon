import {SelectorValue} from './types'

export const findValueInfo = <ValueType>(
  values: SelectorValue<ValueType>[],
  valueToFind?: ValueType, 
): SelectorValue<ValueType> | undefined =>
  values.find(({value}) => value === valueToFind)

export const validateValue = <ValueType>(
  values: SelectorValue<ValueType>[],
  valueToValidate: ValueType, 
): ValueType => {
  let validatedValue = valueToValidate

  let valueExists = findValueInfo(values, validatedValue)

  if (!valueExists && values.length) {
    validatedValue = values[0].value
  }

  return validatedValue
}
