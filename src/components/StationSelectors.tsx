import React, {ReactNode} from 'react'
import kebabCase from 'lodash/kebabCase'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TripOriginIcon from '@material-ui/icons/TripOrigin';

import Selector from './Selector'
import {StationLookup} from '../utils/types'
import {OptionalStationName} from '../store/types'
import stationsLookup from '../data/stations.json'

import useStyles from './StationSelectors.styles'


export type StationChange = (stationName: OptionalStationName) => void


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

interface Props {
  origin: OptionalStationName;
  onOriginChange: StationChange;
  destination: OptionalStationName;
  onDestinationChange: StationChange;
}

const StationSelectors = ({
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
}: Props) => {
  const classes = useStyles()

  return (
    <section className={classes.root}>
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
    </section>
  )
}

export default StationSelectors
