// @flow
import _ from 'lodash'
import routes from '../data/routes.json'
import {Route} from '../data/flowtypes'
import {getEstimatedTimesOfDeparture} from '../api'

const DEFAULT_NUM_SUGGESTIONS = 5

export const _determineRouteIdsFromOrigin = (origin:string, destination:string):Set<string> => new Set(
    _.chain(routes)
        .values()
        // if the route is valid its stations list will have both the origin and destination in it
        // with origin coming before destination
        .filter(({stations}:Route) => {
            let originIndex = stations.indexOf(origin)
            let destinationIndex = stations.indexOf(destination)

            return originIndex > -1 && originIndex < destinationIndex
        })
        .map(({routeID}) => routeID)
        .value()
)

export const getSalmonSuggestions = async (origin:string, destination:string, numSuggestions:number = DEFAULT_NUM_SUGGESTIONS): Promise<any[]> => {
    // 1. Determine the desired routes based on the origin/destination
    // (w/o making a "trip" API request)
    let targetRouteIds = _determineRouteIdsFromOrigin(origin, destination)

    // console.log([...targetRouteIds])

    // 2. Generate a list of the trains heading in the OPPOSITE direction sorted
    // by ascending arrival times (arrivalTime)
    let estimatedDepartureTimes = await getEstimatedTimesOfDeparture()

    // console.log(origin, estimatedDepartureTimes[origin].etd)

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
