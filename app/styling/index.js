// @flow
import {GUTTER_UNIT, GRID_COLUMN_WIDTH} from './constants'

export const gutterSize = (multiplier: number): number => multiplier * GUTTER_UNIT

export const gridSize = (numColumns: number): string => `${(numColumns * GRID_COLUMN_WIDTH * 100).toFixed(2)}%`
