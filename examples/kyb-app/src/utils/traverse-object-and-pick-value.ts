export function traverseObjectAndPickValue<T>(
  key: string,
  object: object,
  defaultValue: T = undefined,
): T {
  if (typeof object === 'object' && object) {
    if (key in object) {
      const value = object[key];
      return value ? value : defaultValue;
    } else {
      for (const prop in object) {
        const nestedResult = traverseObjectAndPickValue(key, object[prop], defaultValue);
        if (nestedResult) {
          return nestedResult;
        }
      }
    }
  }
  return defaultValue;
}
