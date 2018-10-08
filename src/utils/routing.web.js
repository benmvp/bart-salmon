// @flow
import {browserHistory} from 'react-router'

export const getBasePath = () => '/'

export const gotoRoute = (routeName: string) => {
  let basePath = getBasePath()

  browserHistory.push(`${basePath}${routeName}`)
}
