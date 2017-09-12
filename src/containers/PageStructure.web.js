// @flow
import React, {Component, PropTypes} from 'react'
import styles from './PageStructure.styles.web'

export default class PageStructure extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    }

    render = () => {
        let {children} = this.props

        return (
            <div style={styles.root}>
                <main style={styles.main}>
                    {children}
                </main>
            </div>
        )
    }
}
