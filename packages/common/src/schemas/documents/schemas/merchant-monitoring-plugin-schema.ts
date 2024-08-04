import { Type } from '@sinclair/typebox';

// TODO: Once merchant monitoring structure is stable, update this schema
export const MerchantMonitoringPluginSchema = Type.Optional(
  Type.Object({
    data: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
);
