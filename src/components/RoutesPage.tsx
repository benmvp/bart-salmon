import React, {useEffect} from 'react'
import formatDate from 'date-fns/format';

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import RefreshIcon from '@material-ui/icons/Refresh'

import Arrivals from './Arrivals'
import StationSelectors, {StationsChange} from './StationSelectors';
import SalmonRoutes from './SalmonRoutes'
import {SalmonRoute, Train} from '../utils/types'
import {OptionalStationName} from '../store/types'


const LastUpdatedMessage = (
  {
    lastUpdated,
    onRefresh,
  }: {
    lastUpdated: Date | null,
    onRefresh: () => void,
  }
) => {
  if (!lastUpdated) {
    return null
  }


  return (
    <>
      <Box textAlign="center">
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
      </Box>
      <Divider variant="middle" />
    </>
  )
}


interface Props {
  origin: OptionalStationName;
  destination: OptionalStationName;
  numSalmonRoutes: number;
  salmonRoutes: SalmonRoute[] | null;
  arrivals: Train[] | null;
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

  if (arrivals !== null && salmonRoutes !== null) {
    const [nextTrain] = arrivals

    lastUpdatedMessage = (
      <LastUpdatedMessage lastUpdated={lastUpdated} onRefresh={getSalmonInfo} />
    )
    arrivalsAndRoutes = (
      <>
        <Box component="section" mt={2}>
          <Arrivals
            destination={destination}
            arrivals={arrivals}
            numArrivals={numArrivals}
          />
        </Box>
        <Box component="section">
          <SalmonRoutes
            routes={salmonRoutes}
            numRoutes={numSalmonRoutes}
            nextTrain={nextTrain}
          />
        </Box>
      </>
    )
  }

  return (
    <Box component="main">
      {lastUpdatedMessage}
      <Box my={2}>
        <StationSelectors
          origin={origin}
          destination={destination}
          onStationsChange={setStations}
        />
        <Divider variant="middle" />
      </Box>
      {arrivalsAndRoutes}
      <Box mt={3}>
        <Typography align="center" variant="caption" component="p">
          Brought to you with&nbsp;
          <span role="img" aria-label="love">❤️</span> by&nbsp;
          <Link href="http://www.benmvp.com/" target="_blank" rel="noopener noreferrer">Ben Ilegbodu</Link>.
        </Typography>
      </Box>
    </Box>
  )
}

export default RoutesPage
