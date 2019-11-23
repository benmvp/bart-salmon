import React, {ReactNode} from 'react'
import kebabCase from 'lodash/kebabCase'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import LocationOnIcon from '@material-ui/icons/LocationOn'
import TripOriginIcon from '@material-ui/icons/TripOrigin'
import SwapVertIcon from '@material-ui/icons/SwapVert'

import Selector from './Selector'
import {StationLookup} from '../utils/types'
import {OptionalStationName} from '../store/types'
import stationsLookup from '../data/stations.json'

import useStyles from './StationSelectors.styles'


type StationChange = (stationName: OptionalStationName) => void


const STATIONS_LOOKUP = (stationsLookup as unknown) as StationLookup

const STATIONS_SELECTOR_VALUES = Object.values(STATIONS_LOOKUP)
  .map(({name, abbr}) => ({value: abbr as OptionalStationName, display: name}))

interface StationSelectorProps {
  label: string;
  station: OptionalStationName;
  icon: ReactNode;
  onChange: StationChange;
}
const StationSelector = ({label, station, icon, onChange}: StationSelectorProps) => {
  const classes = useStyles()
  const values = [
    { value: '' as OptionalStationName, display: '' },
    ...STATIONS_SELECTOR_VALUES,
  ]

  const selector = Selector<OptionalStationName>({
    id: kebabCase(`${label}-station-selector`),
    label,
    value: station,
    values,
    onChange,
  })

  return (
    <div className={classes.selector}>
      <span className={classes.selectorIcon}>
        {icon}
      </span>
      {selector}
    </div>
  )
}


export type StationsChange = (
  {origin, destination}: {origin: OptionalStationName, destination: OptionalStationName}
) => void

interface Props {
  origin: OptionalStationName;
  destination: OptionalStationName;
  onStationsChange: StationsChange
}

const StationSelectors = ({
  origin,
  destination,
  onStationsChange,
}: Props) => {
  const classes = useStyles()
  const onOriginChange = (newOrigin: OptionalStationName) => onStationsChange({origin: newOrigin, destination})
  const onDestinationChange = (newDestination: OptionalStationName) => onStationsChange({origin, destination: newDestination})
  const onStationSwap = () => onStationsChange({origin: destination, destination: origin})

  return (
    <Box component="section" px={2} display="flex" justifyContent="space-between" alignItems="center">
      <div className={classes.selectors}>
        <StationSelector
          label="Origin"
          station={origin}
          icon={<TripOriginIcon />}
          onChange={onOriginChange}
        />
        <StationSelector
          label="Destination"
          station={destination}
          icon={<LocationOnIcon />}
          onChange={onDestinationChange}
        />
      </div>
      <IconButton
        color="secondary"
        className={classes.swapButton}
        aria-label="Swap stations"
        onClick={onStationSwap}
      >
        <SwapVertIcon />
      </IconButton>
    </Box>
  )
}

export default StationSelectors
