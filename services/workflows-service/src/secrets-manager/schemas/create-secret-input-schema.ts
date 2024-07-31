import { Type } from '@sinclair/typebox';

export const CreateSecretInputSchema = Type.Object({
  key: Type.String({
    description: 'Secret key',
    example: 'secret',
  }),
  value: Type.String({
    description: 'Secret value',
    example: 'secret-value',
  }),
});
