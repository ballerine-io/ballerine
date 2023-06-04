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
