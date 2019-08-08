import { UrlParams } from 'url-lib'
import {
  StationName,
  RouteId,
  Etd,
  Direction,
  Color,
  HexColor,
} from '../utils/types'


export interface ApiStation {
  name: string;
  abbr: StationName;
  gtfsLatitude: number;
  gtfsLongitude: number;
  address: string;
  city: string;
  country: string;
  state: string;
  zipcode: number;
}

export interface ApiStationWithRoute extends ApiStation {
  northRoutes?: { route: RouteId[] };
  southRoutes?: { route: RouteId[] };
  northPlatforms?: { platform: number[] };
  southPlatforms?: { platform: number[] };
  platformInfo: string,
}

export interface ApiStationsResponse {
  stations: {
    station: ApiStation[]
  }
}

export interface ApiStationInfoResponse {
  stations: {
    station: ApiStationWithRoute;
  }
}

export interface ApiEtdResponse {
  date: string;
  time: string;
  station: {
    name: string;
    abbr: StationName;
    etd: Etd[];
  }[]
}

export interface ApiRoute {
  name: string;
  abbr: string;
  routeID: RouteId;
  number: number;
  hexcolor: HexColor;
  color: Color;
}

export interface ApiRouteWithStations extends ApiRoute {
  origin: StationName;
  destination: StationName;
  direction: Direction;
  holidays: number;
  numStns: number;
  config: {
    station: StationName[];
  };
}

export interface ApiRoutesResponse {
  schedNum: number;
  routes: {
    route: ApiRoute[];
  };
}

export interface ApiRouteInfoResponse {
  schedNum: number;
  routes: {
    route: ApiRouteWithStations
  }
}

export interface ApiRouteStop {
  '@station': StationName;
  '@load': number;
  '@level': 'normal';
  '@origTime': 'string';
  '@bikeFlag': number;
}

export interface ApiRouteSchedule {
  '@trainId': string;
  '@trainIdx': number;
  '@index': number;
  stop: ApiRouteStop[]
}

export interface ApiRouteScheduleResponse {
  schedNum: number;
  date: string;
  route: {
    train?: ApiRouteSchedule[]
  }
}

export interface ApiDepartureResponse {
  origin: StationName;
  destination: StationName;
  schedule: {
    date: string;
    time: string;
    before: number;
    after: number;
    request: {
      trip: {
        '@origin': StationName;
        '@destination': StationName;
        '@tripTime': number;
        leg: {
          '@order': number;
          '@origin': StationName;
          '@destinatin': StationName;
          '@line': RouteId;
        }[]
      }[]
    }
  }
}

export interface StationsApiRequest {
  type: 'stn';
  command: 'stns';
  params?: UrlParams;
}
export interface StationInfoApiRequest {
  type: 'stn';
  command: 'stninfo';
  params?: UrlParams;
}
export interface EtdsApiRequest {
  type: 'etd';
  command: 'etd';
  params?: UrlParams;
}
export interface RoutesApiRequest {
  type: 'route';
  command: 'routes';
  params?: UrlParams;
}
export interface RouteInfoApiRequest {
  type: 'route';
  command: 'routeinfo';
  params?: UrlParams;
}
export interface RouteScheduleApiRequest {
  type: 'sched';
  command: 'routesched';
  params?: UrlParams;
}
export interface DepartureApiRequest {
  type: 'sched';
  command: 'depart';
  params?: UrlParams;
}

export type ApiRequest = StationsApiRequest
  | StationInfoApiRequest
  | EtdsApiRequest
  | RoutesApiRequest
  | RouteInfoApiRequest
  | RouteScheduleApiRequest
  | DepartureApiRequest

export type ApiResponse<Request> =
  Request extends StationsApiRequest ? ApiStationsResponse :
  Request extends StationInfoApiRequest ? ApiStationInfoResponse :
  Request extends EtdsApiRequest ? ApiEtdResponse :
  Request extends RoutesApiRequest ? ApiRoutesResponse :
  Request extends RouteInfoApiRequest ? ApiRouteInfoResponse :
  Request extends RouteScheduleApiRequest ? ApiRouteScheduleResponse :
  Request extends DepartureApiRequest ? ApiDepartureResponse :
  undefined
