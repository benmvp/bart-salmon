// @flow

export type Route = {
    name: string,
    abbr: string,
    routeID: string,
    number: number,
    origin: string,
    destination: string,
    direction: string,
    color: string,
    routeID: string,
    holidays: boolean,
    stations: string[]
}

export type Routes = {[id:string]: Route}

export type Train = {
    destination: string,
    abbreviation: string,
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
    backwardsRouteID: string,
    backwardsStation: string,
    backwardsRideTime: number,
    backwardsRideNumStations: number,
    backwardsWaitTime: number,

    returnTrain: Train,
    returnRouteID: string,
    returnRideTime: number
}
