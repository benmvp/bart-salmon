// @flow
import React, {Component} from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import {gotoRoute} from '../utils/routing'
import styles from './Home.styles'

const MenuLink = ({children, onPress}) => (
    <TouchableHighlight underlayColor="#ddd" onPress={onPress}>
        <View style={styles.menuLink}>
            <Text style={[styles.menuLinkText, styles.menuLinkContent]}>{children}</Text>
            <Text style={styles.menuLinkText}>⟩</Text>
        </View>
    </TouchableHighlight>
)

export default class Home extends Component {
    render = () => (
        <View style={styles.root}>
            <MenuLink onPress={gotoRoute.bind(null, 'salmon')}>
                Salmon Routes
            </MenuLink>
        </View>
    )
}
