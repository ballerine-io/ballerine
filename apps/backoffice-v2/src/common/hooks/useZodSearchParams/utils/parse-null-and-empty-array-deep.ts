/**
 * Replaces the placeholder string of null or empty array with null or an empty array respectively - a workaround for qs dropping null and empty arrays
 * @example { a: '__null', b: [1, 2, 3], c: '__emptyArray' } -> { a: null, b: [1, 2, 3], c: [] }
 * @param value
 */
export const parseNullAndEmptyArrayDeep = (value: unknown) => {
  if (value === '__emptyArray') return [];
  if (value === '__null') return null;

  if (Array.isArray(value)) return value.map(parseNullAndEmptyArrayDeep);

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [key, value]) => {
      acc[key] = parseNullAndEmptyArrayDeep(value);

      return acc;
    }, {} as Record<string, unknown>);
  }

  return value;
};
