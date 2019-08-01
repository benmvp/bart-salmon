import { Dictionary } from 'lodash'

export type StationName = '12TH'
  | '16TH'
  | '19TH'
  | '24TH'
  | 'ASHB'
  | 'BALB'
  | 'BAYF'
  | 'CAST'
  | 'CIVC'
  | 'COLS'
  | 'COLM'
  | 'CONC'
  | 'DALY'
  | 'DBRK'
  | 'DUBL'
  | 'DELN'
  | 'PLZA'
  | 'EMBR'
  | 'FRMT'
  | 'FTVL'
  | 'GLEN'
  | 'HAYW'
  | 'LAFY'
  | 'LAKE'
  | 'MCAR'
  | 'MLBR'
  | 'MONT'
  | 'NBRK'
  | 'NCON'
  | 'OAKL'
  | 'ORIN'
  | 'PITT'
  | 'PHIL'
  | 'POWL'
  | 'RICH'
  | 'ROCK'
  | 'SBRN'
  | 'SFIA'
  | 'SANL'
  | 'SHAY'
  | 'SSAN'
  | 'UCTY'
  | 'WARM'
  | 'WCRK'
  | 'WDUB'
  | 'WOAK'

export type RouteId = 'ROUTE 1'
  | 'ROUTE 2'
  | 'ROUTE 3'
  | 'ROUTE 4'
  | 'ROUTE 5'
  | 'ROUTE 6'
  | 'ROUTE 7'
  | 'ROUTE 8'
  | 'ROUTE 11'
  | 'ROUTE 12'
  | 'ROUTE 19'
  | 'ROUTE 20'

export interface RouteStation {
  name: StationName;
  timeFromOrigin: number;
}

export interface Route {
  name: string;
  abbr: string;
  routeID: RouteId;
  number: number;
  origin: StationName;
  destination: StationName;
  direction: string;
  color: string;
  holidays: number;
  stations: RouteStation[];
}

interface Estimate {
  minutes: number;
  platform: number;
  direction: 'South' | 'North';
  length: number;
  color: string;
  hexcolor: string;
  bikeflag: number;
  delay: number;
}

export interface Train extends Estimate {
  destination: string;
  abbreviation: StationName;
  limited: number;
}

export interface SalmonRoute {
  waitTime: number;

  backwardsTrain: Train;
  backwardsRouteId: RouteId;
  backwardsStation: StationName;
  backwardsRideTime: number;
  backwardsWaitTime: number;

  returnTrain: Train;
  returnRouteId: RouteId;
  returnRideTime: number;
}

export type StationRoutesLookup = {
  [Name in StationName]: {
    [Name in StationName]: {
      directRoutes?: RouteId[];
      multiRoutes?: RouteId[][];
    }
  }
}
export type RoutesLookup = {
  [Id in RouteId]: Route
}


export interface Station {
  name: string;
  abbr: StationName;
  gtfsLatitude: number;
  gtfsLongitude: number;
  address: string;
  city: string;
  country: string;
  state: string;
  zipcode: number;
  northRoutes: RouteId[];
  southRoutes: RouteId[];
  northPlatforms: number[],
  southPlatforms: number[];
  platformInfo: string;
}
export type StationLookup = {
  [Name in StationName]: Station;
}


export interface Etd {
  destination: string;
  abbreviation: StationName;
  limited: number;
  estimate: Estimate[]
}
export type EtdsLookup = Dictionary<{
  name: string;
  abbr: StationName;
  etd: Etd[];
}>
