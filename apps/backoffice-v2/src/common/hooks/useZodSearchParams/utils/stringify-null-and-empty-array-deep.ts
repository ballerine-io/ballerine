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
