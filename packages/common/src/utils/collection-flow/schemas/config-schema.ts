import { Static, Type } from '@sinclair/typebox';

const InputCollectionFlowStepSchema = Type.Object({
  stateName: Type.String(),
});

export const CollectionFlowConfigSchema = Type.Object({
  apiUrl: Type.String(),
  steps: Type.Array(InputCollectionFlowStepSchema),
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
