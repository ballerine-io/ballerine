export function traverseObjectAndSetValue<T>(key: string, value: T, object: object) {
  if (typeof object === 'object' && object) {
    if (key in object) {
      object[key] = value;
    } else {
      for (const prop in object) {
        traverseObjectAndSetValue(key, value, object[prop]);
      }
    }
  }
}
