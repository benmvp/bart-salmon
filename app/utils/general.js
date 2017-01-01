// @flow

export const forceArray = (value:mixed):any[] => Array.isArray(value) ? value : [value]
