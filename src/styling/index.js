// @flow
import {Dimensions, Platform} from 'react-native'
import {GUTTER_UNIT, GRID_COLUMN_WIDTH} from './constants'

export const gutterSize = (multiplier: number): number => multiplier * GUTTER_UNIT

const gridSizeWeb = (numColumns: number): string => (
    `${numColumns * GRID_COLUMN_WIDTH * 100}%`
)

const gridSizeNative = (numColumns: number): number => {
    let {width: windowWidth} = Dimensions.get('window')

    return Math.round(numColumns * GRID_COLUMN_WIDTH * windowWidth * 10) / 10
}

export const gridSize = Platform.OS === 'web' ? gridSizeWeb : gridSizeNative
