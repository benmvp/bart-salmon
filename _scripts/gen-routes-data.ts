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
import { genDataFile, processSequentially } from './utils'
import { Route, RouteStation } from '../src/utils/types'


const _getSampleSchedule = (schedules: ApiRouteSchedule[]): ApiRouteSchedule =>
  schedules[Math.max(0, schedules.length - 3)]

const _toMinutes = (stopInfo: ApiRouteStop): number => {
  const time = stopInfo['@origTime']
  const [, hours = '0', minutes = '0'] = time.match(/^(\d\d?):(\d\d)/) || []

  return +hours * 60 + +minutes
}

const _normalizeRoute = (routeInfo: ApiRouteWithStations, schedules?: ApiRouteSchedule[]): Route => {
  let stations: RouteStation[] = []

  if (schedules) {
    const sampleSchedule = _getSampleSchedule(schedules)
    const stationsInSampleSchedule = sampleSchedule.stop.filter(
      (stopInfo) => !!stopInfo['@origTime']
    )
    const firstStopTime = _toMinutes(stationsInSampleSchedule[0])

    stations = stationsInSampleSchedule.map((stopInfo) => ({
      name: stopInfo['@station'],
      timeFromOrigin: _toMinutes(stopInfo) - firstStopTime
    }))
  }

  return {
    ...omit(routeInfo, ['config', 'numStns']),
    stations,
  }
}

const _fetchForEachRoute = <Request extends ApiRequest>(
  respJson: ApiRoutesResponse,
  apiRequest: Request,
) =>
  processSequentially(
    respJson.routes.route,
    ({ number }) => fetchBartInfo<Request>({ ...apiRequest, params: { route: number } }),
    10,
  )

const _getRoutes = async () => {
  const respJson = await fetchBartInfo<RoutesApiRequest>({ type: 'route', command: 'routes' })
  const respRoutes = await _fetchForEachRoute<RouteInfoApiRequest>(
    respJson,
    { type: 'route', command: 'routeinfo' },
  )
  const respSchedules = await _fetchForEachRoute<RouteScheduleApiRequest>(
    respJson,
    { type: 'sched', command: 'routesched' },
  )
  const routes = respRoutes.map((respRoute, index) => (
    _normalizeRoute(
      respRoute.routes.route,
      respSchedules[index].route.train,
    )
  ))

  return keyBy(routes, 'routeID')
}

try {
  genDataFile(_getRoutes, '../src/data/routes.json', 'routes')
} catch (err) {
  console.error(err)
}
