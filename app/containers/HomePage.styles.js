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
        width: '75%'
    },
    label: {
        fontSize: 20,
        marginBottom: 5
    },
    labelWithMargin: {
        marginTop: 30
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
