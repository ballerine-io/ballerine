export const isObject = <TObj extends Record<PropertyKey, any>>(obj: unknown): obj is TObj =>
  !Array.isArray(obj) && obj !== null && typeof obj === 'object';
