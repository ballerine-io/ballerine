export const deepStringToNull = (value: unknown) => {
  if (typeof value === 'string' && value === 'null') return null;

  if (Array.isArray(value)) return value.map(deepStringToNull);

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [key, value]) => {
      acc[key] = deepStringToNull(value);

      return acc;
    }, {} as Record<string, unknown>);
  }

  return value;
};
