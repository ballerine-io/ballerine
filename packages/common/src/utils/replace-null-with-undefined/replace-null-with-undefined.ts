export const replaceNullsWithUndefined = (obj: unknown) => {
  if (obj === null) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceNullsWithUndefined(item));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const objWithoutNulls = Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = replaceNullsWithUndefined(value);

    return acc;
  }, {} as Record<PropertyKey, unknown>);

  return objWithoutNulls;
};
