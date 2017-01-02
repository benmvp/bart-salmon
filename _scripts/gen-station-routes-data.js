// @flow
import _ from 'lodash'
import {fetchJson} from '../app/api/fetch'
import {genDataFile} from './utils'
import {forceArray} from '../app/utils/general'
import stationsLookup from '../app/data/stations.json'

type StationRoute = {
    directRoutes: ?string[],
    multiRoutes: ?string[]
}

const _getDepartSchedules = (orig: string, dest: string): Promise<Object> => (
    fetchJson('sched', 'depart', {orig, dest, time: '5:00pm', date: '01/04/2017'})
)

const _routesOrNull = (_routes) => (_routes.isEmpty() ? undefined : _routes.value())

const _getRoutesForOriginDestination = async (origin: string, destination: string): Promise<Object> => {
    let departSchedules

    try {
        departSchedules = await _getDepartSchedules(origin, destination)
    } catch(ex) {
        // try again just in case there was some transient issue
        departSchedules = await _getDepartSchedules(origin, destination)
    }

    let _trips = _(forceArray(departSchedules.schedule.request.trip))
    let directRoutes = _trips
        .filter((tripInfo) => forceArray(tripInfo.leg).length === 1)
        .map((tripInfo) => forceArray(tripInfo.leg)[0].$.line)
        .uniq()
    let multiRoutes = _trips
        .filter((tripInfo) => forceArray(tripInfo.leg).length > 1)
        .map((tripInfo) => forceArray(tripInfo.leg).map((leg) => leg.$.line))
        .map((tripRoutes) => tripRoutes.join('|'))
        .uniq()
        .map((tripRouteString) => tripRouteString.split('|'))

    return {
        destination,
        directRoutes: _routesOrNull(directRoutes),
        multiRoutes: _routesOrNull(multiRoutes)
    }
}

/*
 * For the given origin station, returns a promise that when fulfilled returns a
 * lookup of destination stations to direct and multi routes
 */
const _getAllDestinationRoutesForStation = async (origin: string): Promise<{[id: string]: StationRoute}> => {
    let getAllDestinationRoutesForStation = _(stationsLookup)
        // get all of the station names
        .keys()

        // exclude the same station since there's no where to travel
        .filter((station) => station !== origin)

        // build a sequence of promises that'll get direct and multi routes info
        // for each origin-destination combination
        .map((destination) => _getRoutesForOriginDestination(origin, destination))
    let allDestinationRoutesForStationList = await Promise.all(getAllDestinationRoutesForStation)

    return _(allDestinationRoutesForStationList)
        // create a look up of the array of information by destination station
        .keyBy('destination')

        // remove the destination prop from the data
        .mapValues(({directRoutes, multiRoutes}) => ({directRoutes, multiRoutes}))
        .value()
}

/*
 * Return a promise that when fulfilled contains a lookup of origin stations to
 * destination stations to direct and multi routes
 */
const _getStationRoutes = async (): Promise<{[id: string]: {[id: string]: StationRoute}}> => {
    let getStationRoutes = _(stationsLookup)
        .keys()
        .map((origin) => _getAllDestinationRoutesForStation(origin))
    let stationRoutesList = await Promise.all(getStationRoutes)

    return _.zipObject(
        Object.keys(stationsLookup),
        stationRoutesList
    )
}

genDataFile(_getStationRoutes, '../app/data/station-routes.json', 'routes between stations')
