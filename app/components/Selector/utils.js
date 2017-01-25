export const findValueInfo = (valueToFind, values) => (
    values.find(({value}) => value === valueToFind)
)

export const validateValue = (valueToValidate, values) => {
    let validatedValue = valueToValidate

    let valueExists = findValueInfo(validatedValue, values)

    if (!valueExists && values.length) {
        validatedValue = values[0].value
    }

    return validatedValue
}
