import {SelectorValue} from './types'

export const findValueInfo = (
  values: SelectorValue[],
  valueToFind?: string, 
): SelectorValue | undefined =>
  values.find(({value}) => value === valueToFind)

export const validateValue = (
  values: SelectorValue[],
  valueToValidate?: string, 
): string | undefined => {
  let validatedValue = valueToValidate

  let valueExists = findValueInfo(values, validatedValue)

  if (!valueExists && values.length) {
    validatedValue = values[0].value
  }

  return validatedValue
}
