export const replaceNullsWithUndefined = (obj: Record<string, object>) => {
  if (obj === null) {
    return undefined;
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] =
      value === null ? undefined : replaceNullsWithUndefined(value as Record<string, object>);
  }

  return newObj;
};
