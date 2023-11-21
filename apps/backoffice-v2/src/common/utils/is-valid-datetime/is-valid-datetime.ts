/**
 * @description Checks if a passed value is a string that match the format YYYY-MM-DD HH:MM:SS.
 * @param value
 * @param isStrict
 */
export const isValidDatetime = (value: unknown, { isStrict = true } = {}): value is string => {
  if (typeof value !== 'string') return false;

  if (!isStrict && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) return true;

  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
};
