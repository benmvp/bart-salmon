import {CSSProperties} from 'react'
import {gutterSize} from '../styling'

export default {
  root: {
    display: 'flex',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '5px',
    height: '24px',
    padding: gutterSize(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // this really shouldn't be part of the component,
    // but in a wrapper handling the spacing
    marginBottom: gutterSize(3),
  } as CSSProperties,
  display: {
    fontSize: '20px',
    flex: '1',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  } as CSSProperties,
  arrow: {} as CSSProperties,
  select: {
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,

    // #6 - allows for adjusting height of <select> in iOS
    webkitAppearance: 'menulist-button',
  } as CSSProperties,
}
