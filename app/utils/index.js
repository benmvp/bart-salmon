// @flow
import getSuggestedSalmonRoutesFromEtds from './salmon'
import {getEstimatedTimesOfDeparture} from '../api'
import type {SalmonRoute, StationName} from './flow'

// default number of salmon suggestions to return
export const DEFAULT_NUM_SUGGESTIONS = 5

export const getSuggestedSalmonRoutes = async (
    origin: StationName,
    destination: StationName,
    numSuggestions: number = DEFAULT_NUM_SUGGESTIONS
): Promise<SalmonRoute[]> => {
    try {
        return getSuggestedSalmonRoutesFromEtds(
            await getEstimatedTimesOfDeparture(),
            origin,
            destination,
            numSuggestions
        )
    } catch (ex) {
        // TODO: log error somewhere
        throw ex
    }
}
