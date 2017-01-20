// @flow
import {StyleSheet} from 'react-native'

const STATION_WIDTH = '35%'
const ROUTE_WIDTH = '40%'
const TIME_WIDTH = '20%'

const HEADER_CELL_STYLES = {
    textAlign: 'center',
    color: '#fff',
    padding: 4
}

export default StyleSheet.create({
    header: {
        backgroundColor: '#222',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerStation: {
        ...HEADER_CELL_STYLES,
        width: STATION_WIDTH
    },
    headerRoute: {
        ...HEADER_CELL_STYLES,
        width: ROUTE_WIDTH
    },
    headerTime: {
        ...HEADER_CELL_STYLES,
        width: TIME_WIDTH
    },
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
        width: STATION_WIDTH,
        fontSize: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: -2
    },
    route: {
        width: ROUTE_WIDTH,
        padding: 4
    },
    routeDir: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textAlign: 'center'
    },
    routeDivider: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        marginTop: 4,
        marginBottom: 4
    },
    time: {
        width: TIME_WIDTH
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
