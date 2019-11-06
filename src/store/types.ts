import {
  StationName,
  SalmonRoute,
  Train,
} from '../utils/types'

export type OptionalStationName = '' | StationName

interface SetStations {
  type: 'SET_STATIONS';
  payload: {
    origin: OptionalStationName;
    destination: OptionalStationName;
  }
}
interface SetNumSalmonRoutes {
  type: 'SET_NUM_SALMON_ROUTES';
  payload: number;
}
interface FetchSalmonInfo {
  type: 'FETCH_SALMON_INFO';
}
interface ReceiveSalmonInfo {
  type: 'RECEIVE_SALMON_INFO';
  payload: {
    routes: SalmonRoute[];
    arrivals: Train[];
    lastUpdated: Date;
  }
}
interface ErrorSalmonInfo {
  type: 'ERROR_SALMON_INFO';
  error: Error;
}
interface SetRiskinessFactor {
  type: 'SET_RISKINESS_FACTOR';
  payload: number;
}
interface SetNumArrivals {
  type: 'SET_NUM_ARRIVALS';
  payload: number;
}

export type AppAction = SetStations
  | SetNumSalmonRoutes
  | FetchSalmonInfo
  | ReceiveSalmonInfo
  | ErrorSalmonInfo
  | SetRiskinessFactor
  | SetNumArrivals
