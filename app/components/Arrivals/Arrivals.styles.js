// @flow
import {StyleSheet} from 'react-native'
import {gridSize} from '../../styling'

export default StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        // empty column on the left & right
        paddingLeft: gridSize(1),
        paddingRight: gridSize(1)
    },
    headingSection: {
        width: gridSize(4)
    },
    headingNextTrain: {
        textAlign: 'right'
    },
    headingDestination: {
        textAlign: 'right',
        // textOverflow: 'ellipsis',
        overflow: 'hidden',
        // whiteSpace: 'nowrap'
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
        width: gridSize(3)
    },
    followingTrainTime: {
    }
})
