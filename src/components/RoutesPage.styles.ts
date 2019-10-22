import { CSSProperties } from 'react'
import { gridSize, gutterSize } from '../styling'

export default {
  root: {
    flex: 1,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as CSSProperties,
  selectorsShell: {
    width: gridSize(12),
    padding: gutterSize(3),
  } as CSSProperties,
  origin: {
    marginBottom: gutterSize(3),
  } as CSSProperties,
  arrivals: {
    width: gridSize(12),
  } as CSSProperties,
  salmonRoutes: {
    flex: 1,
    width: gridSize(12),
  } as CSSProperties,
}
