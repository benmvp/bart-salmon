// @flow
import _ from 'lodash'
import fetchBartInfo from '../app/api/bart'
import {genDataFile} from './utils'

type Route = {
    name: string,
    abbr: string,
    routeID: string,
    number: number,
    origin: string,
    destination: string,
    direction: string,
    color: string,
    routeID: string,
    holidays: boolean,
    stations: string[]
}

type RoutesLookup = {[id: string]: Route}

const _getSampleSchedule = (schedules: Object[]): Object => (
    schedules[schedules.length - 3]
)

const _getStopProp = (stopInfo: Object, propertyName: string): any => (
    stopInfo.$[propertyName]
)

const _getStopOrigTime = (stopInfo: Object): string => _getStopProp(stopInfo, 'origTime')

const _toMinutes = (stopInfo:Object): number => {
    let time = _getStopOrigTime(stopInfo)
    let [, hours, minutes] = time.match(/^(\d\d?):(\d\d)/) || []

    return +hours * 60 + +minutes
}

const _normalizeRoute = (routeInfo: Object, schedules: Object[]): Route => {
    let sampleSchedule = _getSampleSchedule(schedules)
    let stationsInSampleSchedule = sampleSchedule.stop.filter((stopInfo) => !!_getStopOrigTime(stopInfo))
    let firstStopTime = _toMinutes(stationsInSampleSchedule[0])

    return _(routeInfo)
        .omit(['config', 'numStns'])
        .merge({
            stations: stationsInSampleSchedule
                .map((stopInfo) => ({
                    name: _getStopProp(stopInfo, 'station'),
                    timeFromOrigin: _toMinutes(stopInfo) - firstStopTime
                }))
        })
        .value()
}

const _fetchPerRoute = (respJson: Object, fetchType: string, fetchCommand: string) => (
    Promise.all(
        respJson.routes.route.map(({number}) => (
            fetchBartInfo(fetchType, fetchCommand, {route: number})
        ))
    )
)

const _getRoutes = (): Promise<RoutesLookup> => (
    fetchBartInfo('route', 'routes')
        .then((respJson):Promise<Object[]> => (
            Promise.all([
                // fetches for routes info
                _fetchPerRoute(respJson, 'route', 'routeinfo'),

                // fetches for route schedules
                _fetchPerRoute(respJson, 'sched', 'routesched'),
            ])
        ))
        .then(([respRoutes: Object[], respSchedules: Object[]]) => (
            respRoutes.map((respRoute: Object, index): Route => (
                _normalizeRoute(respRoute.routes.route, respSchedules[index].route.train)
            ))
        ))
        .then((routes: Route[]) => _.keyBy(routes, 'routeID'))
)

genDataFile(_getRoutes, '../app/data/routes.json', 'routes')
