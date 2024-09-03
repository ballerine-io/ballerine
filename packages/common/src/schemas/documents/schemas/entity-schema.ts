import { Type } from '@sinclair/typebox';

export const EntitySchema = Type.Object(
  {
    type: Type.String({ enum: ['individual', 'business'] }),
    data: Type.Optional(
      Type.Object(
        {
          additionalInfo: Type.Optional(Type.Object({})),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: false },
);
