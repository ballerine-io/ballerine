import { Type } from '@sinclair/typebox';

import { AmlSchema } from './aml-schema';

export const KycSessionPluginSchema = Type.Optional(
  Type.Record(
    Type.String(),
    Type.Object({
      type: Type.String(),
      vendor: Type.String(),
      result: Type.Object({
        aml: AmlSchema,
        entity: Type.Object({
          type: Type.String(),
          data: Type.Object({
            firstName: Type.Union([Type.String(), Type.Null()]),
            lastName: Type.Union([Type.String(), Type.Null()]),
            dateOfBirth: Type.Union([Type.String(), Type.Null()]),
            additionalInfo: Type.Optional(
              Type.Object({
                gender: Type.Union([Type.String(), Type.Null()]),
                nationality: Type.Union([Type.String(), Type.Null()]),
              }),
            ),
          }),
        }),
        decision: Type.Optional(
          Type.Object({ status: Type.String(), decisionScore: Type.Number() }),
        ),
        metadata: Type.Object({
          id: Type.String(),
          url: Type.String(),
        }),
      }),
    }),
  ),
);
