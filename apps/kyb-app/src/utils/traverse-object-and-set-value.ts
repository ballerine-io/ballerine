export function traverseObjectAndSetValue<T>(
  key: string,
  value: T,
  object_: Record<PropertyKey, unknown>,
) {
  // @ts-ignore - TODO: handle case where object_ is an array or null
  if (typeof object_ === 'object' && object_) {
    if (key in object_) {
      object_[key as keyof object] = value;
    } else {
      for (const prop in object_) {
        // @ts-ignore - TODO: handle case where object_[prop] is not an object
        traverseObjectAndSetValue(key, value, object_[prop]);
      }
    }
  }
}
