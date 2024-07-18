import { Static, Type } from '@sinclair/typebox';

export const CustomDataSchemaUpdateDto = Type.Object({
  type: Type.String({ enum: ['object'] }),
  properties: Type.Object({
    additionalProperties: Type.Optional(Type.Boolean()),
  }),
});

export type TCustomDataSchemaUpdateDto = Static<typeof CustomDataSchemaUpdateDto>;

export const RootLevelContextSchemaDto = Type.Object({
  properties: Type.Object({
    customData: Type.Optional(
      Type.Object({
        type: Type.String({ enum: ['object'] }),
        additionalProperties: Type.Optional(Type.Boolean()),
      }),
    ),
    entity: Type.Object({
      type: Type.String({ enum: ['object'] }),
    }),
    documents: Type.Object({
      type: Type.String({ enum: ['array'] }),
      items: Type.Object({
        type: Type.String({ enum: ['object'] }),
      }),
    }),
  }),
});

export type TRootLevelContextSchemaDto = Static<typeof RootLevelContextSchemaDto>;
