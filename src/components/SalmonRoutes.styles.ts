import {CSSProperties} from 'react';
import {gridSize, gutterSize} from '../styling'

const STATION_COLUMN_STYLES = {
  width: gridSize(4),
}
const ROUTE_COLUMN_STYLES = {
  width: gridSize(5),
}
const TIME_COLUMN_STYLES = {
  width: gridSize(3),
}

const HEADER_CELL_STYLES = {
  textAlign: 'center',
  color: '#fff',
  padding: gutterSize(1),
}

export default {
  header: {
    display: 'flex',
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as CSSProperties,
  headerStation: {
    ...HEADER_CELL_STYLES,
    ...STATION_COLUMN_STYLES,
  } as CSSProperties,
  headerRoute: {
    ...HEADER_CELL_STYLES,
    ...ROUTE_COLUMN_STYLES,
  } as CSSProperties,
  headerTime: {
    ...HEADER_CELL_STYLES,
    ...TIME_COLUMN_STYLES,
  } as CSSProperties,
  salmonRoute: {
    display: 'flex',
    backgroundColor: '#eee',
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  } as CSSProperties,
  station: {
    ...STATION_COLUMN_STYLES,
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: -2,
    // numberOfLines: 2,
  } as CSSProperties,
  route: {
    ...ROUTE_COLUMN_STYLES,
  } as CSSProperties,
  routeDir: {
    textAlign: 'center',
    // numberOfLines: 1,
    // ellipsizeMode: 'middle',
  } as CSSProperties,
  routeDivider: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
    marginTop: gutterSize(1),
    marginBottom: gutterSize(1),
  } as CSSProperties,
  time: {
    ...TIME_COLUMN_STYLES,
    padding: gutterSize(1),
  } as CSSProperties,
  timeValue: {
    fontSize: 45,
    textAlign: 'center',
    // letterSpacing: -10
  } as CSSProperties,
  timeLabel: {
    textAlign: 'center',
  } as CSSProperties,
}
