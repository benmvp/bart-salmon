// @flow
import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    root: {
        flex: 1,

        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectorsShell: {
        width: '75%',
        height: 150,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    swimButton: {
        padding: 10,
        position: 'absolute',
        bottom: 15,
        right: 15
    },
    swimButtonText: {
        fontSize: 50,
    },
})
