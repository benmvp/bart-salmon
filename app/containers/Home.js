// @flow
import React, {Component} from 'react'
import {View, Text} from 'react-native'
import styles from './Home.styles'

export default class Home extends Component {
    render() {
        return (
            <View style={styles.view}>
                <Text>Bart Salmon</Text>
            </View>
        )
    }
}
