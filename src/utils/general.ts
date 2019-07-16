export const forceArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value]

export const normalizeMinutes = (minutes: string | number): number =>
  Number.isNaN(+minutes) ? 0 : +minutes
