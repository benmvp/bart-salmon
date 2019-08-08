import keyBy from 'lodash/keyBy'
import omit from 'lodash/omit'
import { fetchBartInfo } from '../src/api/bart'
import {
  ApiRequest,
  RoutesApiRequest,
  RouteInfoApiRequest,
  ApiRouteWithStations,
  ApiRoutesResponse,
} from '../src/api/types'
import { genDataFile, processSequentially } from './utils'
import { Route } from '../src/utils/types'


const _normalizeRoute = (routeInfo: ApiRouteWithStations): Route => ({
  ...omit(routeInfo, ['config', 'numStns', 'direction']),
  stations: routeInfo.config.station,
})

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
  const routes = respRoutes.map((respRoute) => _normalizeRoute(respRoute.routes.route))

  return keyBy(routes, 'routeID')
}

try {
  genDataFile(_getRoutes, '../src/data/routes.json', 'routes')
} catch (err) {
  console.error(err)
}
