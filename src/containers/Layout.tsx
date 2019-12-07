import React, { ReactNode } from 'react'
import {navigate, WindowLocation} from '@reach/router'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import TrainIcon from '@material-ui/icons/Train'
import SettingsIcon from '@material-ui/icons/Settings'

import Footer from '../components/Footer'


interface Props {
  // @reach/router props
  children: ReactNode;
  path: string;
  location?: WindowLocation;
}

const Layout = ({children, location}: Props) => {
  const selectedNav = location && location.pathname === '/settings' ? 'settings' : 'routes'

  return (
    <Box component="main" pb={8}>
      {children}

      <Box mt={5}>
        <Footer />
      </Box>

      <Box position="fixed" bottom={0} left={0} width="100%">
        <Divider variant="fullWidth" />

        <BottomNavigation
          value={selectedNav}
          onChange={(e, newValue) => {
            navigate(newValue === 'settings' ? 'settings' : '/')
          }}
          showLabels
        >
          <BottomNavigationAction label="Routes" value="routes" icon={<TrainIcon />} />
          <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Box>
    </Box>
  )
}

export default Layout
