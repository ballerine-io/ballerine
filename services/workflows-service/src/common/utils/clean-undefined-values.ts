export const cleanUndefinedValues = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const cleanedObj = {} as T;
  Object.keys(obj).forEach(key => {
    const value = (obj as any)[key];

    if (value !== undefined) {
      if (typeof value === 'object' && value !== null) {
        (cleanedObj as any)[key] = cleanUndefinedValues(value);
      } else {
        (cleanedObj as any)[key] = value;
      }
    }
  });

  return cleanedObj;
};
