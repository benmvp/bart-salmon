import React, {useEffect} from 'react'
import isEmpty from 'lodash/isEmpty'
import formatDate from 'date-fns/format';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import RefreshIcon from '@material-ui/icons/Refresh'

import Arrivals from './Arrivals'
import StationSelectors, {StationsChange} from './StationSelectors';
import SalmonRoutes from './SalmonRoutes'
import {SalmonRoute, Train} from '../utils/types'
import {OptionalStationName} from '../store/types'

import useStyles from './RoutesPage.styles'


const LastUpdatedMessage = (
  {
    lastUpdated,
    onRefresh,
  }: {
    lastUpdated: Date | null,
    onRefresh: () => void,
  }
) => {
  const classes = useStyles()

  if (!lastUpdated) {
    return null
  }


  return (
    <>
      <div className={classes.lastUpdatedShell}>
        <Typography display="inline" variant="body2"  color="textSecondary">
          Last updated {formatDate(lastUpdated, 'eee @ h:mma')}
        </Typography>
        <IconButton
          color="secondary"
          aria-label="Refresh salmon routes"
          size="small"
          onClick={onRefresh}
        >
          <RefreshIcon />
        </IconButton>
      </div>
      <Divider variant="middle" />
    </>
  )
}


interface Props {
  origin: OptionalStationName;
  destination: OptionalStationName;
  numSalmonRoutes: number;
  salmonRoutes: SalmonRoute[];
  arrivals: Train[];
  lastUpdated: Date | null;
  numArrivals: number;
  isDisabled: boolean;
  setStations: StationsChange;
  getSalmonInfo: () => void;
}

const RoutesPage= ({
  origin,
  destination,
  numSalmonRoutes,
  setStations,
  getSalmonInfo,
  salmonRoutes,
  arrivals,
  lastUpdated,
  numArrivals,
}: Props) => {

  // load salmon info the first the page loads
  // afterwards, we'll rely on station changes
  useEffect(() => {
    getSalmonInfo()
  }, [getSalmonInfo])

  let arrivalsAndRoutes
  let lastUpdatedMessage

  if (!isEmpty(arrivals)) {
    const [nextTrain] = arrivals

    lastUpdatedMessage = (
      <LastUpdatedMessage lastUpdated={lastUpdated} onRefresh={getSalmonInfo} />
    )
    arrivalsAndRoutes = (
      <>
        <div>
          <Arrivals
            destination={destination}
            arrivals={arrivals}
            numArrivals={numArrivals}
          />
        </div>
        <div>
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
    <div>
      {lastUpdatedMessage}
      <StationSelectors
        origin={origin}
        destination={destination}
        onStationsChange={setStations}
      />
      {arrivalsAndRoutes}
    </div>
  )
}

export default RoutesPage
