import React, {FunctionComponent, useEffect} from 'react'
import isEmpty from 'lodash/isEmpty'
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
    {value: '' as OptionalStationName, display: label},
    ...STATIONS_SELECTOR_VALUES,
  ]

  return Selector<OptionalStationName>({
    value: station,
    values,
    onChange,
  })
}


interface Props {
  salmonRoutes: SalmonRoute[];
  arrivals: Train[];
  setOrigin: (name: OptionalStationName) => void;
  setDestination: (name: OptionalStationName) => void;
  getSalmonInfo: () => void;
  origin: OptionalStationName;
  destination: OptionalStationName;
  isDisabled: boolean;
}

const RoutesPage: FunctionComponent<Props> = ({
  origin,
  destination,
  setOrigin,
  setDestination,
  getSalmonInfo,
  salmonRoutes,
  arrivals,
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
          <Arrivals destination={destination} arrivals={arrivals} />
        </div>
        <div style={styles.salmonRoutes}>
          <SalmonRoutes routes={salmonRoutes} nextTrain={nextTrain} />
        </div>
      </>
    )
  }

  return (
    <div style={styles.root}>
      <section style={styles.selectorsShell}>
        <StationSelector
          label="ORIGIN"
          station={origin}
          onChange={setOrigin}
        />
        <StationSelector
          label="DESTINATION"
          station={destination}
          onChange={setDestination}
        />
      </section>
      {arrivalsAndRoutes}
    </div>
  )
}

export default RoutesPage
