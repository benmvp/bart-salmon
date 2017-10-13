// @flow
import {StyleSheet} from 'react-native'
import {gridSize, gutterSize} from '../styling'

export default StyleSheet.create({
  root: {
    flex: 1,

    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorsShell: {
    width: gridSize(12),
    paddingTop: gutterSize(3),
    paddingRight: gutterSize(3),
    paddingLeft: gutterSize(3),
  },
  arrivals: {
    width: gridSize(12),
  },
  salmonRoutes: {
    flex: 1,
    width: gridSize(12),
  },
})
