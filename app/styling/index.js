// @flow
import {Dimensions} from 'react-native'
import {GUTTER_UNIT, GRID_COLUMN_WIDTH} from './constants'

export const gutterSize = (multiplier: number): number => multiplier * GUTTER_UNIT

export const gridSize = (numColumns: number): number => {
    let {width: windowWidth} = Dimensions.get('window')

    return Math.round(numColumns * GRID_COLUMN_WIDTH * windowWidth * 10) / 10
}
