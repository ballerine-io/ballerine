import { Type } from '@sinclair/typebox';

import { defaultPluginSchema } from '../default-context-schema';
import { AmlSchema } from './aml-schema';

export const IndividualSanctionsPluginSchema = Type.Optional(
  Type.Composite([
    defaultPluginSchema,
    Type.Object({
      data: AmlSchema,
    }),
  ]),
);
