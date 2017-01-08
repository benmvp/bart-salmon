// @flow
import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center'
    }
})

export default class Home extends Component {
    render() {
        return (
            <View style={styles.view}>
                <Text>Bart Salmon</Text>
            </View>
        )
    }
}
