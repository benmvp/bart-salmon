// @flow
import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    salmonRoute: {
        backgroundColor: '#eee',
        marginBottom: 1,
        padding: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5
    },
    station: {
        width: '35%',
        fontSize: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: -2
    },
    route: {
        width: '40%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        padding: 4
    },
    routeDir: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textAlign: 'center'
    },
    time: {
        width: '20%'
    },
    timeValue: {
        fontSize: 60,
        textAlign: 'center',
        letterSpacing: -10
    },
    timeLabel: {
        textAlign: 'center'
    }
})
