import keyBy from 'lodash/keyBy'
import omit from 'lodash/omit'
import { fetchBartInfo } from '../src/api/bart'
import {
  ApiRequest,
  RoutesApiRequest,
  RouteInfoApiRequest,
  RouteScheduleApiRequest,
  ApiRouteWithStations,
  ApiRouteStop,
  ApiRouteSchedule,
  ApiRoutesResponse,
} from '../src/api/types'
import { genDataFile } from './utils'
import { Route } from '../src/utils/types'


const _getSampleSchedule = (schedules: ApiRouteSchedule[]): ApiRouteSchedule =>
  schedules[schedules.length - 3]

const _toMinutes = (stopInfo: ApiRouteStop): number => {
  const time = stopInfo['@origTime']
  const [, hours = '0', minutes = '0'] = time.match(/^(\d\d?):(\d\d)/) || []

  return +hours * 60 + +minutes
}

const _normalizeRoute = (routeInfo: ApiRouteWithStations, schedules: ApiRouteSchedule[]): Route => {
  const sampleSchedule = _getSampleSchedule(schedules)
  const stationsInSampleSchedule = sampleSchedule.stop.filter(
    (stopInfo) => !!stopInfo['@origTime']
  )
  const firstStopTime = _toMinutes(stationsInSampleSchedule[0])

  return {
    ...omit(routeInfo, ['config', 'numStns']),
    stations: stationsInSampleSchedule.map((stopInfo) => ({
      name: stopInfo['@station'],
      timeFromOrigin: _toMinutes(stopInfo) - firstStopTime
    }))
  }
}

const _fetchPerRoute = <Request extends ApiRequest>(
  respJson: ApiRoutesResponse,
  apiRequest: Request,
) =>
  Promise.all(
    respJson.routes.route.map(({ number }) =>
      fetchBartInfo<Request>({ ...apiRequest, params: { route: number } })
    )
  )

const _getRoutes = async () => {
  const respJson = await fetchBartInfo<RoutesApiRequest>({ type: 'route', command: 'routes' })
  const [respRoutes, respSchedules] = await Promise.all([
    // fetches for routes info
    _fetchPerRoute<RouteInfoApiRequest>(respJson, { type: 'route', command: 'routeinfo' }),

    // fetches for route schedules
    _fetchPerRoute<RouteScheduleApiRequest>(respJson, { type: 'sched', command: 'routesched' })
  ])
  const routes = respRoutes.map((respRoute, index) =>
    _normalizeRoute(
      respRoute.routes.route,
      respSchedules[index].route.train
    )
  )

  return keyBy(routes, 'routeID')
}

genDataFile(_getRoutes, '../src/data/routes.json', 'routes')
