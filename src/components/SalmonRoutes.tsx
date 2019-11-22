import React, {useState, ChangeEvent} from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Chip from '@material-ui/core/Chip'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TrainIcon from '@material-ui/icons/Train'
import PanToolIcon from '@material-ui/icons/PanTool'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import stationsLookup from '../data/stations.json'
import {getSalmonTimeFromRoute} from '../utils/salmon'
import {Train, SalmonRoute as SalmonRouteData} from '../utils/types'

import useStyles from './SalmonRoutes.styles'

interface WaitBadgeProps {
  waitTime: number;
  lateMessage: string;
}

const WaitBadge = ({waitTime, lateMessage}: WaitBadgeProps) => (
  <Badge
    badgeContent={waitTime <= 0 ? lateMessage : waitTime}
    color={waitTime <= 0 ? 'secondary' : 'primary'}
    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
  >
    <PanToolIcon />
  </Badge>
)

interface SalmonRouteProps {
  route: SalmonRouteData;
  nextTrain: Train;
  isExpanded: boolean;
  onChange: (event: ChangeEvent<{}>, isExpanded: boolean) => void;
}

const SalmonRoute = ({
  route,
  nextTrain,
  isExpanded,
  onChange,
}: SalmonRouteProps) => {
  const classes = useStyles()
  const {
    waitTime,
    backwardsTrain,
    backwardsStation,
    backwardsWaitTime,
    returnTrain,
  } = route
  const salmonTime = getSalmonTimeFromRoute(route)
  const backwardsStationInfo = stationsLookup[backwardsStation]
  const backwardsStationName = backwardsStationInfo.name
  let salmonTimeAdditionalTime = salmonTime


  if (nextTrain) {
    // Make sure the minimal time is 0
    // It shouldn't be less than 0 but there are some slight discrepancies between
    // forward and backward route times
    salmonTimeAdditionalTime = Math.max(
      0,
      salmonTimeAdditionalTime - nextTrain.minutes,
    )
  }

  const additionalSalmonTimeDisplay = salmonTimeAdditionalTime > 0 ? `+${salmonTimeAdditionalTime}` : '——'

  return (
    <ExpansionPanel expanded={isExpanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container justify="space-between" alignItems="center" wrap="nowrap">
          <Grid item xs={9}>
            <Typography variant="h5" component="span">
              {backwardsStationName}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" component="span" className={classes.additionalTime}>
              {additionalSalmonTimeDisplay}
            </Typography>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box flex="1">
          <Box mb={3} display="flex" alignItems="center">
            <WaitBadge waitTime={waitTime} lateMessage="Now" />
            <ChevronRightIcon className={classes.arrow} />
            <Chip icon={<TrainIcon />} label={backwardsTrain.destination} />
          </Box>
          <Box display="flex" alignItems="center">
            <TransferWithinAStationIcon fontSize="large" />
            <ChevronRightIcon className={classes.stationArrow} />
            <Chip
              variant="outlined"
              label={backwardsStationInfo.name}
            />
          </Box>
          <Box mt={3} display="flex" alignItems="center">
            <WaitBadge waitTime={backwardsWaitTime} lateMessage="<1" />
            <ChevronRightIcon className={classes.arrow} />
            <Chip
              icon={<TrainIcon />}
              label={`${returnTrain.destination} — ${returnTrain.length}-car`}
            />
          </Box>
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

interface Props {
  routes: SalmonRouteData[];
  numRoutes: number;
  nextTrain: Train;
}

const SalmonRoutes = ({
  routes,
  numRoutes,
  nextTrain,
}: Props) => {
  const [expandedRouteIndex, setExpandRouteIndex] = useState(-1)

  const handleExpandedChange = (panelIndex: number) => (
    (event: ChangeEvent<{}>, isExpanded: boolean) => {
      setExpandRouteIndex(isExpanded ? panelIndex : -1)
    }
  )

  // TODO: Salmon routes need some sort of unique identifier
  const salmonRoutes = routes
    .map((route, index) => (
      <SalmonRoute
        key={index}
        route={route}
        nextTrain={nextTrain}
        isExpanded={index === expandedRouteIndex}
        onChange={handleExpandedChange(index)}
      />
    ))
    .slice(0, numRoutes)

  return (
    <Box>
      {salmonRoutes}
    </Box>
  )
}

export default SalmonRoutes
