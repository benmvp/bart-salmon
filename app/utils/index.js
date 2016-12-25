// @flow
import _ from 'lodash'
import routes from '../data/routes.json'
import {Route} from '../data/flowtypes'

const DEFAULT_NUM_SUGGESTIONS = 5

export const _determineRouteIdFromOrigin = (origin:string, destination:string):string => (
    _.chain(routes)
        .values()
        // if the route is valid its stations list will have both the origin and destination in it
        // with origin coming before destination
        .find(({stations}:Route) => stations.indexOf(origin) < stations.indexOf(destination))
        .value()
        .routeID
)

export const getSalmonSuggestions = (origin:string, destination:string, numSuggestions:number = DEFAULT_NUM_SUGGESTIONS): any[] => {
    // time to next train in opposite direction at origin station
    // time for that train to approach each station
    // list of trains that will get to destination from given station
    // time for each destination train to get back to origin station

    // 1. Determine the desired route based on the origin/destination
    // (w/o making a "trip" API request)
    let targetRouteId = _determineRouteIdFromOrigin(origin, destination)

    // 2. Determine estimated time for target route to arrive at origin and
    // add to suggestions

    // 3. Generate a list of the trains heading in the OPPOSITE direction sorted
    // by ascending arrival times (arrivalTime)

    // 4. For each train, determine the estimated time it would take to get to
    // each following station in its route (backwardsTime)

    // 5. For each train at each station, determine the estimated wait time until
    // targetRouteId arrives at that station (waitTime)

    // 6. For each train at each station after waiting, determine estimated time
    // it would take to return to the origin on target route (returnTime)

    // 7. Add up arrivalTime + backwardsTime + waitTime + returnTime for each
    // backwards/return route pair and add to list of suggestions

    // 8. Sort by ascending time and take the first numSuggestions suggestions

    return []
}
