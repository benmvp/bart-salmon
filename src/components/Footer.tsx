import React from 'react'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import useStyles from './Footer.styles'

const Footer = () => {
  const classes = useStyles()

  return (
    <Box mt={3} component="footer">
      <Divider />

      <Typography align="center" variant="caption" component="p" className={classes.message}>
        Brought to you with&nbsp;
        <span role="img" aria-label="love">❤️</span> by&nbsp;
        <Link href="http://www.benmvp.com/" target="_blank" rel="noopener noreferrer">Ben Ilegbodu</Link>.
      </Typography>
    </Box>
  )
}

export default Footer