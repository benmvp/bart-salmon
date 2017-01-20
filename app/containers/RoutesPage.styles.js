// @flow
import {StyleSheet} from 'react-native'
import {gridSize} from '../styling'

export default StyleSheet.create({
    root: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    arrivals: {
        width: gridSize(12)
    },
    salmonRoutes: {
        flex: 1,
        width: gridSize(12)
    }
})
