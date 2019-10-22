import React, {useEffect, ReactNode} from 'react'
import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import Arrivals from './Arrivals'
import SalmonRoutes from './SalmonRoutes'
import Selector from './Selector'
import {SalmonRoute, Train, StationLookup} from '../utils/types'
import {OptionalStationName} from '../store/types'
import stationsLookup from '../data/stations.json'

import useStyles from './RoutesPage.styles'


const STATIONS_LOOKUP = (stationsLookup as unknown) as StationLookup

const STATIONS_SELECTOR_VALUES = Object.values(STATIONS_LOOKUP)
  .map(({name, abbr}) => ({value: abbr as OptionalStationName, display: name}))

interface StationSelectorProps {
  label: string;
  station: OptionalStationName;
  icon: ReactNode;
  onChange: (stationName: OptionalStationName) => void;
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
    <div className={classes.stationSelector}>
      <span className={classes.stationSelectorIcon}>
        {icon}
      </span>
      {selector}
    </div>
  )
}


interface Props {
  origin: OptionalStationName;
  destination: OptionalStationName;
  numSalmonRoutes: number;
  salmonRoutes: SalmonRoute[];
  arrivals: Train[];
  numArrivals: number;
  setOrigin: (name: OptionalStationName) => void;
  setDestination: (name: OptionalStationName) => void;
  getSalmonInfo: () => void;
  isDisabled: boolean;
}

const RoutesPage= ({
  origin,
  destination,
  numSalmonRoutes,
  setOrigin,
  setDestination,
  getSalmonInfo,
  salmonRoutes,
  arrivals,
  numArrivals,
}: Props) => {
  const classes = useStyles()

  // load salmon info the first the page loads
  // afterwards, we'll rely on station changes
  useEffect(() => {
    getSalmonInfo()
  }, [getSalmonInfo])

  let arrivalsAndRoutes

  if (!isEmpty(arrivals)) {
    const [nextTrain] = arrivals

    arrivalsAndRoutes = (
      <>
        <div className={classes.arrivals}>
          <Arrivals
            destination={destination}
            arrivals={arrivals}
            numArrivals={numArrivals}
          />
        </div>
        <div className={classes.salmonRoutes}>
          <SalmonRoutes
            routes={salmonRoutes}
            numRoutes={numSalmonRoutes}
            nextTrain={nextTrain}
          />
        </div>
      </>
    )
  }

  return (
    <div className={classes.root}>
      <section className={classes.stationSelectors}>
        <StationSelector
          label="Origin"
          station={origin}
          icon={<TripOriginIcon />}
          onChange={setOrigin}
        />
        <StationSelector
          label="Destination"
          station={destination}
          icon={<LocationOnIcon />}
          onChange={setDestination}
        />
      </section>
      {arrivalsAndRoutes}
    </div>
  )
}

export default RoutesPage
