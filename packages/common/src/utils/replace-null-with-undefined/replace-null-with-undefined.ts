export const replaceNullsWithUndefined = (obj: unknown) => {
  if (obj === null) {
    return undefined;
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const objWithoutNulls = Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = replaceNullsWithUndefined(value);
    return acc;
  }, {} as Record<PropertyKey, unknown>);

  return objWithoutNulls;
};
