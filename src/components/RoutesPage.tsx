import React, {FunctionComponent, useEffect} from 'react'
import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'
import Arrivals from './Arrivals'
import SalmonRoutes from './SalmonRoutes'
import Selector from './Selector'
import {SalmonRoute, Train, StationLookup} from '../utils/types'
import {OptionalStationName} from '../store/types'
import stationsLookup from '../data/stations.json'

import styles from './RoutesPage.styles'


const STATIONS_LOOKUP = (stationsLookup as unknown) as StationLookup

const STATIONS_SELECTOR_VALUES = Object.values(STATIONS_LOOKUP)
  .map(({name, abbr}) => ({value: abbr as OptionalStationName, display: name}))

const StationSelector: FunctionComponent<{
  label: string,
  station: OptionalStationName,
  onChange: (stationName: OptionalStationName) => void,
}> = ({label, station, onChange}) => {
  const values = [
    { value: '' as OptionalStationName, display: '' },
    ...STATIONS_SELECTOR_VALUES,
  ]

  return Selector<OptionalStationName>({
    id: kebabCase(`${label}-station-selector`),
    label,
    value: station,
    values,
    onChange,
  })
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

const RoutesPage: FunctionComponent<Props> = ({
  origin,
  destination,
  numSalmonRoutes,
  setOrigin,
  setDestination,
  getSalmonInfo,
  salmonRoutes,
  arrivals,
  numArrivals,
}) => {
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
        <div style={styles.arrivals}>
          <Arrivals
            destination={destination}
            arrivals={arrivals}
            numArrivals={numArrivals}
          />
        </div>
        <div style={styles.salmonRoutes}>
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
    <div style={styles.root}>
      <section style={styles.selectorsShell}>
        <div style={styles.origin}>
          <StationSelector
            label="Origin"
            station={origin}
            onChange={setOrigin}
          />
        </div>
        <StationSelector
          label="Destination"
          station={destination}
          onChange={setDestination}
        />
      </section>
      {arrivalsAndRoutes}
    </div>
  )
}

export default RoutesPage
