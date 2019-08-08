export const normalizeMinutes = (minutes: string | number): number =>
  Number.isNaN(+minutes) ? 0 : +minutes
