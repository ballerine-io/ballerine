/**
 * @description Checks if a passed value is a string that match the format YYYY-MM-DD HH:MM:SS.
 * @param value
 */
export const isValidDatetime = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;

  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
};
