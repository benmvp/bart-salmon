// @flow
import {Actions} from 'react-native-router-flux'

export const gotoRoute = (routeName: string) => {
    Actions[routeName]()
}
