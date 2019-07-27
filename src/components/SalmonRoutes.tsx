import React, {FunctionComponent} from 'react'
import stationsLookup from '../data/stations.json'
import {getSalmonTimeFromRoute} from '../utils/salmon'
import {Train, SalmonRoute as SalmonRouteData, SalmonRoute} from '../utils/types'

import styles from './SalmonRoutes.styles'

interface SalmonRouteProps {
  route: SalmonRouteData;
  nextTrain: Train;
}

const SalmonRoute: FunctionComponent<{route: SalmonRouteData, nextTrain: Train}> = ({
  route, 
  nextTrain,
}) => {
  const {
    waitTime,
    backwardsTrain,
    backwardsStation,
    backwardsWaitTime,
    returnTrain,
  } = route
  const salmonTime = getSalmonTimeFromRoute(route)
  const backwardsStationInfo = stationsLookup[backwardsStation]
  const backwardsStationName = backwardsStationInfo.name.toUpperCase()
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

  const minutesLabel = salmonTimeAdditionalTime === 1 ? 'minute' : 'minutes'
  const additiveDisplay = salmonTimeAdditionalTime > 0 ? '⁺' : undefined

  return (
    <div style={styles.salmonRoute}>
      <span style={styles.station}>
        {backwardsStationName}
      </span>
      <div style={styles.route}>
        <span style={styles.routeDir}>
          {backwardsTrain.destination} in {waitTime}
        </span>
        <div style={styles.routeDivider} />
        <span style={styles.routeDir}>
          {backwardsWaitTime} for {returnTrain.destination}
        </span>
      </div>
      <div style={styles.time}>
        <span style={styles.timeValue}>
          {additiveDisplay}
          {salmonTimeAdditionalTime}
        </span>
        <span style={styles.timeLabel}>{minutesLabel}</span>
      </div>
    </div>
  )
}

const Header: FunctionComponent<{}> = () => (
  <h2 style={styles.header}>
    <span style={styles.headerStation}>Swim To</span>
    <span style={styles.headerRoute}>Route</span>
    <span style={styles.headerTime}>Add</span>
  </h2>
)

interface Props {
  routes: SalmonRouteData[];
  nextTrain: Train;
}

const SalmonRoutes: FunctionComponent<Props> = ({
  routes,
  nextTrain,
}) => {
  // TODO: Salmon routes need some sort of unique identifier
  const salmonRoutes = routes.map((route, index) => (
    <SalmonRoute key={index} route={route} nextTrain={nextTrain} />
  ))

  return (
    <section>
      <Header />
      {salmonRoutes}
    </section>
  )
}

export default SalmonRoutes
