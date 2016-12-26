// @flow
import lazy from 'lazy.js'
import {Route} from '../data/flowtypes'
import {getEstimatedTimesOfDeparture} from '../api'
import routesLookup from '../data/routes.json'
import stationsLookup from '../data/stations.json'

const DEFAULT_NUM_SUGGESTIONS = 5
const STATION_ROUTE_DIRECTIONS = ['northRoutes', 'southRoutes']

const _determineRouteIdsFromOrigin = (origin:string, destination:string):string[] => (
    lazy(routesLookup)
        .values()
        // if the route is valid its stations list will have both the origin and destination in it
        // with origin coming before destination
        .filter(({stations}:Route) => {
            let originIndex = stations.indexOf(origin)
            let destinationIndex = stations.indexOf(destination)

            return originIndex > -1 && originIndex < destinationIndex
        })
        .map(({routeID}) => routeID)
        .toArray()
)

export const getSalmonSuggestions = async (origin:string, destination:string, numSuggestions:number = DEFAULT_NUM_SUGGESTIONS): Promise<any[]> => {
    let etdLookup = await getEstimatedTimesOfDeparture()
    let etdForOrigin = etdLookup[origin].etd
    let stationInfo = stationsLookup[origin]

    // 1. Determine the desired routes based on the origin/destination
    // (w/o making a "trip" API request)
    let targetRouteIds = _determineRouteIdsFromOrigin(origin, destination)

    // 2. Generate a list of the trains heading in the OPPOSITE direction sorted
    // by ascending arrival times (arrivalTime)
    let oppositeRouteDestinations = new Set(
        lazy(STATION_ROUTE_DIRECTIONS)
            // get the list of route IDs in either direction
            .map((routeDirection) => stationInfo[routeDirection])

            // find the route IDs in that are in the opposite direction by seeing
            // if the targetRouteIds are NOT in the routes for the direction
            .find((routesInDirection) => lazy(routesInDirection).intersection(targetRouteIds).isEmpty())

            // transform those opposite routeIDs into their final destinations
            // (for easy lookup later)
            .map((routeId) => routesLookup[routeId].destination)
    )

    let oppositeDirectionTrains = lazy(etdForOrigin)
        // take ETDs grouped by destination & filter down trains to the ones
        // going in the opposite direction by looking to see if the train's
        // destination is in the oppositeRouteDestinations
        .filter((destinationEtdInfo) => oppositeRouteDestinations.has(destinationEtdInfo.abbreviation))

        // for each set of ETDs for the destinations going in the opposite direction
        // add the destination info to the ETD info
        .map((destinationEtdInfo) => (
            destinationEtdInfo.estimate.map((estimate) => (
                lazy(destinationEtdInfo)
                    .omit(['estimate'])
                    .merge(estimate)
                    .toObject()
            ))
        ))

        // flatten out the groupings (now that each one has the destination info)
        .flatten()

        // now that we've flattened we can sort by the arrival times mixing the
        // destinations
        .sortBy('minutes')

        .toArray()

    // console.log(targetRouteIds, oppositeDirectionTrains)

    // 3. For each train, determine the estimated time it would take to get to
    // each following station in its route (backwardsTime)

    // 4. For each train at each station, determine the estimated wait time until
    // targetRouteId arrives at that station (waitTime)

    // 5. For each train at each station after waiting, determine estimated time
    // it would take to return to the origin on target route (returnTime)

    // 6. Add up arrivalTime + backwardsTime + waitTime + returnTime for each
    // backwards/return route pair and add to list of suggestions

    // 7. Sort by ascending time and take the first numSuggestions suggestions

    return []
}
