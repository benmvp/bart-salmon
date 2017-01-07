// @flow
import etds from './etds-rush-pm.json'

export const getEstimatedTimesOfDeparture = () => (
    new Promise((resolve) => {
        setTimeout(resolve.bind(null, etds), 0)
    })
)
