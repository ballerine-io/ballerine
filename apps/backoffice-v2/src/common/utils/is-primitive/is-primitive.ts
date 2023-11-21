import { Primitive } from '../../types';

export const isPrimitive = (value: unknown): value is Primitive => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  );
};
