import {gutterSize, gridSize} from './'
import {GUTTER_UNIT} from './constants'

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
  '0.00%',
  '8.33%',
  '16.67%',
  '25.00%',
  '33.33%',
  '41.67%',
  '50.00%',
  '58.33%',
  '66.67%',
  '75.00%',
  '83.33%',
  '91.67%',
  '100.00%',
]

describe('gridSize', () => {
  GRID_SIZES.forEach((expectedWidth, numColumns) => {
    it(`returns ${expectedWidth} for ${numColumns} columns`, () => {
      let actualWidth = gridSize(numColumns)

      expect(actualWidth).toBe(expectedWidth)
    })
  })
})
