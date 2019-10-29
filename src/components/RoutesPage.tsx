import React, {useEffect} from 'react'
import isEmpty from 'lodash/isEmpty'
import Arrivals from './Arrivals'
import StationSelectors, {StationChange} from './StationSelectors';
import SalmonRoutes from './SalmonRoutes'
import {SalmonRoute, Train} from '../utils/types'
import {OptionalStationName} from '../store/types'

import useStyles from './RoutesPage.styles'


interface Props {
  origin: OptionalStationName;
  destination: OptionalStationName;
  numSalmonRoutes: number;
  salmonRoutes: SalmonRoute[];
  arrivals: Train[];
  numArrivals: number;
  setOrigin: StationChange;
  setDestination: StationChange;
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
      <StationSelectors
        origin={origin}
        onOriginChange={setOrigin}
        destination={destination}
        onDestinationChange={setDestination}
      />
      {arrivalsAndRoutes}
    </div>
  )
}

export default RoutesPage
