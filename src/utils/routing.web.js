// @flow
import {browserHistory} from 'react-router'

export const getBasePath = () =>
  process.env.NODE_ENV === 'production' ? '/bart-salmon/' : '/'

export const gotoRoute = (routeName: string) => {
  let basePath = getBasePath()

  browserHistory.push(`${basePath}${routeName}`)
}
