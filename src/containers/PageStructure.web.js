// @flow
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styles from './PageStructure.styles.web'

export default class PageStructure extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render = () => {
    let {children} = this.props

    return (
      <div style={styles.root}>
        <main style={styles.main}>{children}</main>
      </div>
    )
  }
}
