import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import DepartureBoardIcon from '@material-ui/icons/DepartureBoard'
import NotInterestedIcon from '@material-ui/icons/NotInterested'
import {Train} from '../utils/types'
import {OptionalStationName} from '../store/types'
import stationsLookup from '../data/stations.json'

import useStyles from './Arrivals.styles'


const ArrivingTrains =  ({trains, numArrivals}: {trains: Train[], numArrivals: number}) => {
  const classes = useStyles()
  let content: JSX.Element | JSX.Element[] = trains.map(({minutes, destination}, index) => (
    <Chip
      key={index}
      label={`${minutes} — ${destination}`}
      color={index === 0 ? 'primary' : undefined}
      variant={index === 0 ? undefined : 'outlined'}
      className={classes.trainBubble}
    />
  )).slice(0, numArrivals)

  if (content.length === 0) {
    content = (
      <>
        <NotInterestedIcon fontSize="large" />
        <Typography variant="h5" component="p">
          There are no available trains
        </Typography>
      </>
    )
  }

  return (
    <Box px={3} mb={2} textAlign="center">
      {content}
    </Box>
  )
}

interface Props {
  destination: OptionalStationName;
  arrivals: Train[];
  numArrivals: number;
}

const Arrivals = ({
  destination,
  arrivals,
  numArrivals,
}: Props) => {
  const classes = useStyles()
  const destinationDisplay = destination && stationsLookup[destination].name

  return (
    <Box>
      <Box px={2} pb={0.5} mb={1} display="flex">
        <DepartureBoardIcon />
        <Typography variant="subtitle1" component="h2" className={classes.heading}>
          Times for trains to {destinationDisplay}:
        </Typography>
      </Box>
      <ArrivingTrains trains={arrivals} numArrivals={numArrivals} />
    </Box>
  )
}

export default Arrivals
