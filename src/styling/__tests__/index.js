// @flow
import {gutterSize, gridSize} from '../'
import {GUTTER_UNIT} from '../constants'

describe('gutterSize', () => {
  it('returns 0 for 0 multiplier', () => {
    let actualGutter = gutterSize(0)

    expect(actualGutter).toBe(0)
  })

  it('returns gutter unit for 1 multiplier', () => {
    let actualGutter = gutterSize(1)

    expect(actualGutter).toBe(GUTTER_UNIT)
  })

  it('returns 2x gutter unit for 2 multiplier', () => {
    let actualGutter = gutterSize(2)

    expect(actualGutter).toBe(2 * GUTTER_UNIT)
  })

  it('returns 8x gutter unit for 8 multiplier', () => {
    let actualGutter = gutterSize(8)

    expect(actualGutter).toBe(8 * GUTTER_UNIT)
  })
})

const GRID_SIZES = [
  [1, '8.33%'],
  [2, '16.67%'],
  [3, '25.00%'],
  [4, '33.33%'],
  [5, '41.67%'],
  [6, '50.00%'],
  [7, '58.33%'],
  [8, '66.67%'],
  [9, '75.00%'],
  [10, '83.33%'],
  [11, '91.67%'],
  [12, '100.00%'],
]

describe('gridSize', () => {
  GRID_SIZES.forEach(([numColumns, expectedWidth]) => {
    it(`returns ${expectedWidth} for ${numColumns} columns`, () => {
      let actualWidth = gridSize(numColumns)

      expect(actualWidth).toBe(expectedWidth)
    })
  })
})
