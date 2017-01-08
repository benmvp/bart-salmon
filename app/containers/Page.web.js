// @flow
import React, {Component, PropTypes} from 'react'
import {View, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    root: {
        height: '100vh',
    },
    main: {
        flex: 1,
    }
})

export default class Page extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    }

    render() {
        let {children} = this.props

        return (
            <View style={styles.root}>
                <View accessibilityRole="main" style={styles.main}>
                    {children}
                </View>
            </View>
        )
    }
}
