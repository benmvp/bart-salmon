// @flow
import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headingSection: {
        width: '30%'
    },
    heading: {
        textAlign: 'right'
    },
    nextTrain: {
        width: '30%',
        flex: 1,
        margin: 12
    },
    nextTrainTime: {
        fontSize: 84,
        letterSpacing: -2,
        textAlign: 'center'
    },
    followingTrains: {
        width: '30%'
    },
    followingTrainTime: {
    }
})
