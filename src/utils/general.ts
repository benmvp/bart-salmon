export const normalizeMinutes = (minutes: number | string): number =>
  Number.isNaN(+minutes) ? 0 : +minutes
