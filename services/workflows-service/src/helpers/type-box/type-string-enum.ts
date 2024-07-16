import { Type } from '@sinclair/typebox';

export const TypeStringEnum = <T extends string[]>(values: [...T], description?: string) =>
  Type.Unsafe<T[number]>({
    type: 'string',
    enum: values,
    description,
  });
