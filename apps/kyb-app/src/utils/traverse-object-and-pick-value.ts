export function traverseObjectAndPickValue<T>(
  key: string,
  object: Record<PropertyKey, unknown>,
  defaultValue?: T,
): typeof defaultValue {
  if (typeof object === 'object' && object) {
    if (key in object) {
      const value = object[key];

      // @ts-ignore
      return value ? value : defaultValue;
    } else {
      for (const prop in object) {
        if (typeof object[prop] === 'object' && object[prop]) {
          const nestedResult = traverseObjectAndPickValue(
            key,
            // @ts-ignore
            object[prop],
            defaultValue,
          );

          if (nestedResult) {
            return nestedResult;
          }
        }
      }
    }
  }
  return defaultValue;
}
