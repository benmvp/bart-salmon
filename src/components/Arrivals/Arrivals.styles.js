// @flow
import {StyleSheet} from 'react-native'
import {gridSize, gutterSize} from '../../styling'

export default StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headingSection: {
        paddingLeft: gutterSize(3),
        width: gridSize(4)
    },
    headingNextTrain: {
        textAlign: 'right'
    },
    headingDestination: {
        textAlign: 'right',
    },
    nextTrain: {
        width: gridSize(3),
        flex: 1,
    },
    nextTrainTime: {
        fontSize: 84,
        textAlign: 'center'
    },
    followingTrains: {
        paddingRight: gutterSize(3),
        width: gridSize(3)
    },
    followingTrainTime: {
    }
})
