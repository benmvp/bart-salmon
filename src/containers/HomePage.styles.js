// @flow
import {StyleSheet} from 'react-native'
import {gridSize, gutterSize} from '../styling'

const SELECTOR_SHELL_HEIGHT = 150

export default StyleSheet.create({
  root: {
    flex: 1,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorsShell: {
    width: gridSize(8),
    minHeight: SELECTOR_SHELL_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  swimButton: {
    padding: gutterSize(2),
    position: 'absolute',
    bottom: gutterSize(3),
    right: gutterSize(3),
  },
  swimButtonText: {
    fontSize: 50,
  },
})
