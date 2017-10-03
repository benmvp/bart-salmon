// @flow

import type {StationName, SalmonRoute} from '../utils/flow'

export type ReduxState = {
  origin: StationName,
  destination: StationName,
  isFetching: boolean,
  salmonRoutes: SalmonRoute[],
  numSalmonRoutes: number,
}
