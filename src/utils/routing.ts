import {browserHistory} from 'react-router'

export const getBasePath = (): string =>
  process.env.NODE_ENV === 'production' ? '/bart-salmon/' : '/'

export const gotoRoute = (routeName: string): void => {
  const basePath = getBasePath()

  browserHistory.push(`${basePath}${routeName}`)
}
