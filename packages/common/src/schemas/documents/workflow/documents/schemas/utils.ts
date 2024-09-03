import { StringOptions, Type } from '@sinclair/typebox';

export const TypeStringEnum = <T extends string[]>(
  values: [...T] | readonly [...T],
  options: StringOptions = {},
) =>
  Type.Unsafe<T[number]>({
    type: 'string',
    enum: values,
    ...options,
  });
