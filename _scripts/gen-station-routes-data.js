// @flow
import _ from 'lodash'
import fetchBartInfo from '../src/api/bart'
import {genDataFile} from './utils'
import {forceArray} from '../src/utils/general'
import stationsLookup from '../src/data/stations.json'

type StationRoute = {
    directRoutes: ?(string[]),
    multiRoutes: ?(string[])
}

const NUM_FETCH_TRIES = 5

const _fetchDepartSchedules = (
    orig: string,
    dest: string,
    time: string
): Promise<Object> =>
    fetchBartInfo('sched', 'depart', {orig, dest, time, date: '5/17/2017'})

const _getDepartSchedules = async (
    origin: string,
    destination: string,
    time: string
): Promise<Object> => {
    let departSchedules
    let numTries = 0

    while (!departSchedules && numTries < NUM_FETCH_TRIES) {
        try {
            departSchedules = await _fetchDepartSchedules(
                origin,
                destination,
                time
            )
        } catch (ex) {
            // try again just in case there was some transient issue
            numTries++
        }
    }

    return departSchedules
}

const _routesOrNull = (_routes) =>
    _routes.isEmpty() ? undefined : _routes.value()

const _getRoutesForOriginDestination = async (
    origin: string,
    destination: string
): Promise<Object> => {
    let departSchedulesEvening = await _getDepartSchedules(
        origin,
        destination,
        '5:00pm'
    )
    let departSchedulesLateNight = await _getDepartSchedules(
        origin,
        destination,
        '11:00pm'
    )

    let _trips = _(
        forceArray(departSchedulesEvening.schedule.request.trip)
    ).union(forceArray(departSchedulesLateNight.schedule.request.trip))
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
const _getAllDestinationRoutesForStation = async (
    origin: string
): Promise<{[id: string]: StationRoute}> => {
    let getAllDestinationRoutesForStation = _(stationsLookup)
        // get all of the station names
        .keys()
        // exclude the same station since there's no where to travel
        .filter((station) => station !== origin)
        // build a sequence of promises that'll get direct and multi routes info
        // for each origin-destination combination
        .map((destination) => _getRoutesForOriginDestination(origin, destination))
    let allDestinationRoutesForStationList = await Promise.all(
        getAllDestinationRoutesForStation
    )

    return (
        _(allDestinationRoutesForStationList)
            // create a look up of the array of information by destination station
            .keyBy('destination')
            // remove the destination prop from the data
            .mapValues(({directRoutes, multiRoutes}) => ({
                directRoutes,
                multiRoutes
            }))
            .value()
    )
}

/*
 * Return a promise that when fulfilled contains a lookup of origin stations to
 * destination stations to direct and multi routes
 */
const _getStationRoutes = async (): Promise<{
    [id: string]: {[id: string]: StationRoute}
}> => {
    let getStationRoutes = _(stationsLookup)
        .keys()
        .map((origin) => _getAllDestinationRoutesForStation(origin))
    let stationRoutesList = await Promise.all(getStationRoutes)

    return _.zipObject(Object.keys(stationsLookup), stationRoutesList)
}

genDataFile(
    _getStationRoutes,
    '../src/data/station-routes.json',
    'routes between stations'
)
