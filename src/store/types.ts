import {Store} from 'redux'
import {
  StationName, 
  SalmonRoute, 
  Train,
} from '../utils/types'


interface SetOriginAction {
  type: 'SET_ORIGIN';
  payload: StationName;
}
interface SetDestination {
  type: 'SET_DESTINATION';
  payload: StationName;
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
    arrivals: Train[]
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

export type AppAction = SetOriginAction
  | SetDestination
  | SetNumSalmonRoutes
  | FetchSalmonInfo
  | ReceiveSalmonInfo
  | ErrorSalmonInfo
  | SetRiskinessFactor