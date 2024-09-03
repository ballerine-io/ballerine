import { Type } from '@sinclair/typebox';

const HitDataSchema = Type.Object({
  date: Type.Union([Type.Null(), Type.String()]),
  sourceUrl: Type.Union([Type.Null(), Type.String()]),
  sourceName: Type.Union([Type.Null(), Type.String()]),
});

const HitsSchema = Type.Array(
  Type.Object({
    matchedName: Type.String(),
    countries: Type.Array(Type.String()),
    matchTypes: Type.Array(Type.String()),
    pep: Type.Array(HitDataSchema),
    warnings: Type.Array(HitDataSchema),
    sanctions: Type.Array(HitDataSchema),
    adverseMedia: Type.Array(HitDataSchema),
    fitnessProbity: Type.Array(HitDataSchema),
  }),
);

export const AmlSchema = Type.Optional(
  Type.Object({
    hits: HitsSchema,
    id: Type.String(),
    clientId: Type.String(),
    createdAt: Type.String(),
    endUserId: Type.String(),
    matchStatus: Type.String(),
    checkType: Type.String({ enum: ['initial_result', 'updated_result'] }),
  }),
);
