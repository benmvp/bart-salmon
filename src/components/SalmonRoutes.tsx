import React, {useState, ChangeEvent, ReactNode} from 'react'
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
import {getSalmonTimeFromRoute, getSalmonAdditionalTime} from '../utils/salmon'
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
    salmonTimeAdditionalTime = getSalmonAdditionalTime(route, nextTrain)
  }

  const additionalSalmonTimeDisplay = salmonTimeAdditionalTime > 0 ? `+${salmonTimeAdditionalTime}` : '——'

  return (
    <ExpansionPanel expanded={isExpanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container justify="space-between" alignItems="center" wrap="nowrap">
          <Grid item xs={9}>
            <Typography variant="h6" component="span">
              {backwardsStationName}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" component="div" className={classes.additionalTime} align="right">
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

interface HeadingProps {
  children: ReactNode;
}

const Heading = ({children}: HeadingProps) => (
  <Box bgcolor="grey.200" px={2} py={0.5}>
    <Typography variant="subtitle1" component="h2">{children}</Typography>
  </Box>
)

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

  const noAdditionalTimeIndex = routes.findIndex((route) => getSalmonAdditionalTime(route, nextTrain) === 0)
  const firstAdditionalTimeIndex = routes.findIndex((route) => getSalmonAdditionalTime(route, nextTrain) > 0)

  // TODO: Salmon routes need some sort of unique identifier
  let salmonRoutes = routes
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

  if (firstAdditionalTimeIndex > -1) {
    salmonRoutes.splice(
      firstAdditionalTimeIndex,
      0,
      (<Heading key="additional">Swim upstream & add...</Heading>)
    )
  }
  if (noAdditionalTimeIndex > -1) {
    salmonRoutes.splice(
      noAdditionalTimeIndex,
      0,
      (<Heading key="same-time">Swim upstream & catch the same train!</Heading>)
    )
  }

  return (
    <Box>
      {salmonRoutes}
    </Box>
  )
}

export default SalmonRoutes
