export const deepNullToString = (value: unknown) => {
  if (value === null) return 'null';

  if (Array.isArray(value)) return value.map(deepNullToString);

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [key, value]) => {
      acc[key] = deepNullToString(value);

      return acc;
    }, {} as Record<string, unknown>);
  }

  return value;
};
