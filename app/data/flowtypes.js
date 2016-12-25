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
