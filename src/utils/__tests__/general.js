// @flow
import {forceArray} from '../general'

describe('forceArray', () => {
  it('wraps a non-array in an array', () => {
    let value = {foo: 'bar'}
    let forcedArray = forceArray(value)

    expect(forcedArray).toEqual([value])
    expect(forcedArray[0]).toBe(value)
  })

  it('just returns back the array', () => {
    let value = ['hello', 'bye']
    let forcedArray = forceArray(value)

    expect(forcedArray).toBe(value)
  })
})
