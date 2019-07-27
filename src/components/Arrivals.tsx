import React, {FunctionComponent, Component} from 'react'
import {Train, StationName} from '../utils/types'
import stationsLookup from '../data/stations.json'

import styles from './Arrivals.styles'


const _displayMinutes = (minutes: number): string =>
  `${minutes} ${minutes === 1 ? 'min' : 'mins'}`

const NextTrain: FunctionComponent<{train?: Train}> = ({train}) => {
  if (!train) {
    return null
  }

  const {minutes} = train

  return (
    <div style={styles.nextTrain}>
      <span style={styles.nextTrainTime}>{minutes}</span>
    </div>
  )
}

const FollowingTrains: FunctionComponent<{trains: Train[]}> = ({trains}) => {
  const trainComponents = trains.map(({minutes}, index) => (
    <span key={index} style={styles.followingTrainTime}>
      {_displayMinutes(minutes)}
    </span>
  ))

  return <div style={styles.followingTrains}>{trainComponents}</div>
}

const Arrivals: FunctionComponent<{destination: StationName, arrivals: Train[]}> = ({
  destination, 
  arrivals,
}) => {
  const [firstTrain, ...followingTrains] = arrivals
  const destinationDisplay = destination && stationsLookup[destination].name

  return (
    <section style={styles.root}>
      <div style={styles.headingSection}>
        <span style={styles.headingNextTrain}>Next train to</span>
        <span style={styles.headingDestination}>
          {destinationDisplay}
        </span>
      </div>
      <NextTrain train={firstTrain} />
      <FollowingTrains trains={followingTrains} />
    </section>
  )
}
