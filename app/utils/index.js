// @flow
import getSuggestedSalmonRoutesFromETDs from './_salmon'
import {getEstimatedTimesOfDeparture} from '../api'
import type {SalmonRoute} from '../data/flowtypes'

// default number of salmon suggestions to return
const DEFAULT_NUM_SUGGESTIONS = 5

export const getSuggestedSalmonRoutes = async (
    origin: string,
    destination: string,
    numSuggestions: number = DEFAULT_NUM_SUGGESTIONS
): Promise<SalmonRoute[]> => {
    try {
        return getSuggestedSalmonRoutesFromETDs(
            await getEstimatedTimesOfDeparture(),
            origin,
            destination,
            numSuggestions
        )
    } catch (ex) {
        throw ex
        // TODO: log error somewhere
        // return []
    }
}
