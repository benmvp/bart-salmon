// @flow
import {browserHistory} from 'react-router'

export const gotoRoute = (routeName: string) => {
    browserHistory.push(`/${routeName}`)
}
