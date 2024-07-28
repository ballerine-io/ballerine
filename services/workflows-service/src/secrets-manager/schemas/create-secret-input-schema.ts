import { Type } from '@sinclair/typebox';

export const CreateSecretInputSchema = Type.Object({
  secrets: Type.Record(
    Type.String({
      description: 'Secret name',
    }),
    Type.String({
      description: 'Secret value',
    }),
  ),
});
