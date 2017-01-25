// @flow
import React, {Component, PropTypes} from 'react'
import {View} from 'react-native'
import styles from './PageStructure.styles.web'

export default class PageStructure extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    }

    render = () => {
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
