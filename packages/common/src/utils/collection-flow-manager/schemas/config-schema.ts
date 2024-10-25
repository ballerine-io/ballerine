import { Static, Type } from '@sinclair/typebox';
import Ajv from 'ajv';

const ajv = new Ajv();

const TCollectionFlowStepSchema = Type.Object({
  stateName: Type.String(),
});

export const CollectionFlowManagerConfigSchema = Type.Object({
  apiUrl: Type.String(),
  steps: Type.Array(TCollectionFlowStepSchema),
  additionalInformation: Type.Optional(
    Type.Object({
      customerCompany: Type.Optional(Type.String()),
    }),
  ),
});

export const collectionFlowConfigValidationSchema = ajv.compile(CollectionFlowManagerConfigSchema);

export type CollectionFlowManagerConfig = Static<typeof CollectionFlowManagerConfigSchema>;
