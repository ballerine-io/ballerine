import { Static, Type } from '@sinclair/typebox';

const CollectionFlowStepSchema = Type.Object({
  stateName: Type.String(),
});

export const CollectionFlowConfigSchema = Type.Object({
  apiUrl: Type.String(),
  steps: Type.Array(CollectionFlowStepSchema),
  additionalInformation: Type.Optional(
    Type.Object(
      {
        customerCompany: Type.Optional(Type.String()),
      },
      { additionalProperties: true },
    ),
  ),
});

export type TCollectionFlowConfig = Static<typeof CollectionFlowConfigSchema>;
