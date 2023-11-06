import { AnyObject } from '@ballerine/ui';

export const serializeValue = <T = unknown>(value: T, jsonSchema: AnyObject): T => {
  if (jsonSchema?.type === 'number') return Number(value) as T;

  return value;
};
