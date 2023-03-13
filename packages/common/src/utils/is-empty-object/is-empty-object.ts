import { isObject } from '@/utils/is-object';

export const isEmptyObject = <TObj extends Record<PropertyKey, unknown>>(
  obj: unknown,
): obj is TObj => isObject(obj) && Object.keys(obj).length === 0;
