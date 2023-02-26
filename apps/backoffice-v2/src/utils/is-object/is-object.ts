export const isObject = <TRecord extends Record<PropertyKey, any>>(
  value: unknown,
): value is TRecord => {
  return typeof value === 'object' && value !== null;
};
