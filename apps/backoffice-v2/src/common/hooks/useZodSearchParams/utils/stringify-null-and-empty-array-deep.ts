/**
 * Replaces null or empty array with a placeholder string - a workaround for qs dropping null and empty arrays
 * @example { a: null, b: [1, 2, 3], c: [] } -> { a: '__null', b: [1, 2, 3], c: '__emptyArray' }
 * @param value
 */
export const stringifyNullAndEmptyArrayDeep = (value: unknown) => {
  if (Array.isArray(value) && !value.length) return '__emptyArray';
  if (value === null) return '__null';

  if (Array.isArray(value)) return value.map(stringifyNullAndEmptyArrayDeep);

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [key, value]) => {
      acc[key] = stringifyNullAndEmptyArrayDeep(value);

      return acc;
    }, {} as Record<string, unknown>);
  }

  return value;
};
