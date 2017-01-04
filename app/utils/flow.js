// @flow

export type StationName = '12TH' | '16TH' | '19TH' | '24TH' | 'ASHB' | 'BALB' | 'BAYF' | 'CAST' | 'CIVC' | 'COLS' | 'COLM' | 'CONC' | 'DALY' | 'DBRK' | 'DUBL' | 'DELN' | 'PLZA' | 'EMBR' | 'FRMT' | 'FTVL' | 'GLEN' | 'HAYW' | 'LAFY' | 'LAKE' | 'MCAR' | 'MLBR' | 'MONT' | 'NBRK' | 'NCON' | 'OAKL' | 'ORIN' | 'PITT' | 'PHIL' | 'POWL' | 'RICH' | 'ROCK' | 'SBRN' | 'SFIA' | 'SANL' | 'SHAY' | 'SSAN' | 'UCTY' | 'WCRK' | 'WDUB' | 'WOAK'

export type RouteId = 'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3' | 'ROUTE 4' | 'ROUTE 5' | 'ROUTE 6' | 'ROUTE 7' | 'ROUTE 8' | 'ROUTE 11' | 'ROUTE 12' | 'ROUTE 19' | 'ROUTE 20'

export type Train = {
    destination: string,
    abbreviation: StationName,
    limited: number,
    minutes: number,
    platform: number,
    direction: string,
    length: number,
    color: string,
    hexcolor: string,
    bikeflag: number
}

export type SalmonRoute = {
    waitTime: number,

    backwardsTrain: Train,
    backwardsRouteId: RouteId,
    backwardsStation: StationName,
    backwardsRideTime: number,
    backwardsRideNumStations: number,
    backwardsWaitTime: number,

    returnTrain: Train,
    returnRouteId: RouteId,
    returnRideTime: number
}
