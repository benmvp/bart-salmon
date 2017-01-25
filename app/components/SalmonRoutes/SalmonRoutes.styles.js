// @flow
import {StyleSheet} from 'react-native'
import {gridSize, gutterSize} from '../../styling'

const STATION_COLUMN_STYLES = {
    width: gridSize(4)
}
const ROUTE_COLUMN_STYLES = {
    width: gridSize(5)
}
const TIME_COLUMN_STYLES = {
    width: gridSize(3)
}

const HEADER_CELL_STYLES = {
    textAlign: 'center',
    color: '#fff',
    padding: gutterSize(1)
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
        ...STATION_COLUMN_STYLES,
    },
    headerRoute: {
        ...HEADER_CELL_STYLES,
        ...ROUTE_COLUMN_STYLES,
    },
    headerTime: {
        ...HEADER_CELL_STYLES,
        ...TIME_COLUMN_STYLES,
    },
    salmonRoute: {
        backgroundColor: '#eee',
        marginBottom: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5
    },
    station: {
        ...STATION_COLUMN_STYLES,
        fontSize: 30,
        // textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: -2
    },
    route: {
        ...ROUTE_COLUMN_STYLES,
    },
    routeDir: {
        overflow: 'hidden',
        // whiteSpace: 'nowrap',
        textAlign: 'center'
    },
    routeDivider: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        marginTop: gutterSize(1),
        marginBottom: gutterSize(1)
    },
    time: {
        ...TIME_COLUMN_STYLES,
        padding: gutterSize(1)
    },
    timeValue: {
        fontSize: 60,
        textAlign: 'center',
        // letterSpacing: -10
    },
    timeLabel: {
        textAlign: 'center'
    }
})
