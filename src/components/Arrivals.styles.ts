import {CSSProperties} from 'react'
import {gridSize, gutterSize} from '../styling'

export default {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as CSSProperties,
  headingSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: gutterSize(3),
    width: gridSize(4),
  } as CSSProperties,
  headingNextTrain: {
    textAlign: 'right',
  } as CSSProperties,
  headingDestination: {
    textAlign: 'right',
    // numberOfLines: 1,
    // ellipsizeMode: 'middle',
  } as CSSProperties,
  nextTrain: {
    width: gridSize(3),
    flex: 1,
  } as CSSProperties,
  nextTrainTime: {
    fontSize: 84,
    textAlign: 'center',
  } as CSSProperties,
  followingTrains: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: gutterSize(3),
    width: gridSize(3),
  } as CSSProperties,
  followingTrainTime: {} as CSSProperties,
}
