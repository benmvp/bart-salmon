// @flow
import getSuggestedSalmonRoutesFromEtds from './salmon'
import {getEstimatedTimesOfDeparture} from '../api'
import {DEFAULT_NUM_SALMON_ROUTES} from './constants'
import type {SalmonRoute, StationName} from './flow'

export const getSuggestedSalmonRoutes = async (
    origin: StationName,
    destination: StationName,
    numSuggestions: number = DEFAULT_NUM_SALMON_ROUTES
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
