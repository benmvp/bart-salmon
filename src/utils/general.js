// @flow

export const forceArray = (value: mixed): any[] =>
  Array.isArray(value) ? value : [value]

export const normalizeMinutes = (minutes: mixed): number =>
  Number.isNaN(+minutes) ? 0 : +minutes
