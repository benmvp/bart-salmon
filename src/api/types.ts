import {UrlParams} from 'url-lib'
import {StationName, Etd} from '../utils/types'

interface EtdsApi {
  type: 'etd';
  command: 'etd';
  params?: UrlParams;
}
interface RoutesApi {
  type: 'route';
  command: 'routes';
  params?: UrlParams;
}
interface DepartureApi {
  type: 'sched';
  command: 'depart';
  params?: UrlParams;
}
interface StationsApi {
  type: 'stn';
  command: 'stns';
  params?: UrlParams;
}
interface StationInfoApi {
  type: 'stn';
  command: 'stninfo';
  params?: UrlParams;
}

export type ApiRequest = EtdsApi
  | RoutesApi
  | DepartureApi
  | StationsApi
  | StationInfoApi

export type ParsedXmlEtdResponse = {
  uri: string;
  date: string;
  time: string;
  station: {
    name: string;
    abbr: StationName;
    etd: Etd[];
  }[]
}
export type ParsedXmlRootResponse = ParsedXmlEtdResponse

