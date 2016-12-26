import etds from './etds.json'

export const getEstimatedTimesOfDeparture = () => (
    new Promise((resolve) => {
        setTimeout(resolve.bind(null, etds), 0)
    })
)
