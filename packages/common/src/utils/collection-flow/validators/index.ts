import Ajv from 'ajv';
import { CollectionFlowConfigSchema } from '../schemas/config-schema';

const ajv = new Ajv({
  strict: true,
  allErrors: true,
});

export const isCollectionFlowInputConfigValid = ajv.compile(CollectionFlowConfigSchema);
