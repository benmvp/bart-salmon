import { ThunkAction } from 'redux-thunk'
import {
  getSuggestedSalmonRoutesFromEtds,
  getNextArrivalsFromEtds,
} from '../utils/salmon'
import { getEstimatedTimesOfDeparture } from '../api'
import { SalmonRoute, Train } from '../utils/types'
import { AppAction, OptionalStationName } from './types'
import { AppState } from './reducers'


type ThunkResult<Result> = ThunkAction<Result, AppState, undefined, AppAction>

export const setNumSalmonRoutes = (numRoutes: number): AppAction => ({
  type: 'SET_NUM_SALMON_ROUTES',
  payload: numRoutes,
})

export const setRiskinessFactor = (riskinessFactor: number): AppAction => ({
  type: 'SET_RISKINESS_FACTOR',
  payload: riskinessFactor,
})

const fetchSalmonInfo = (): AppAction => ({
  type: 'FETCH_SALMON_INFO',
})

const receiveSalmonInfo = (
  routes: SalmonRoute[],
  arrivals: Train[],
): AppAction => ({
  type: 'RECEIVE_SALMON_INFO',
  payload: {
    routes,
    arrivals,
  },
})

const errorSalmonInfo = (error: Error): AppAction => ({
  type: 'ERROR_SALMON_INFO',
  error,
})

export const getSalmonInfo = (): ThunkResult<void> => async (
  dispatch,
  getState,
) => {
  const { origin, destination, numSalmonRoutes, riskinessFactor } = getState()

  if (origin && destination) {
    dispatch(fetchSalmonInfo())

    try {
      const etdsLookup = await getEstimatedTimesOfDeparture()
      const salmonRoutes = getSuggestedSalmonRoutesFromEtds(
        etdsLookup,
        origin,
        destination,
        riskinessFactor,
        numSalmonRoutes,
      )
      const arrivals = getNextArrivalsFromEtds(
        etdsLookup,
        origin,
        destination,
      )

      dispatch(receiveSalmonInfo(salmonRoutes, arrivals))
    } catch (error) {
      // TODO: Create a custom Error that wraps this native error message
      // to be more friendly
      dispatch(errorSalmonInfo(error))
    }
  }
}

export const setStations = (
  { origin, destination }: { origin: OptionalStationName, destination: OptionalStationName },
): ThunkResult<void> => (dispatch) => {
  dispatch({
    type: 'SET_STATIONS',
    payload: {
      origin,
      destination,
    },
  })
  dispatch(getSalmonInfo())
}

export const setNumArrivals = (numRoutes: number): AppAction => ({
  type: 'SET_NUM_ARRIVALS',
  payload: numRoutes,
})
