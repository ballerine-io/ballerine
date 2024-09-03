import { Static, Type } from '@sinclair/typebox';

import { AmlSchema } from './schemas/aml-schema';
import { EntitySchema } from './schemas/entity-schema';
import { DocumentsSchema } from './schemas/documents-schema';
import { KycSessionPluginSchema } from './schemas/kyc-session-plugin-schema';
import { UboPluginSchema } from '@/schemas/documents/schemas/ubo-plugin-schema';
import { MerchantScreeningPluginSchema } from '@/schemas/documents/merchant-screening-plugin-schema';
import { CompanySanctionsPluginSchema } from '@/schemas/documents/schemas/company-sanctions-plugin-schema';
import { MerchantMonitoringPluginSchema } from '@/schemas/documents/schemas/merchant-monitoring-plugin-schema';
import { BusinessInformationPluginSchema } from '@/schemas/documents/schemas/business-information-plugin-schema';

export const defaultInputContextSchema = Type.Object({
  customData: Type.Optional(Type.Object({}, { additionalProperties: true })),
  entity: Type.Union([
    Type.Composite([EntitySchema, Type.Object({ id: Type.String() })]),
    Type.Composite([EntitySchema, Type.Object({ ballerineEntityId: Type.String() })]),
  ]),
  documents: DocumentsSchema,
});

export const defaultContextSchema = Type.Composite([
  defaultInputContextSchema,
  Type.Object({
    aml: AmlSchema,
    pluginsOutput: Type.Optional(
      Type.Object(
        {
          ubo: UboPluginSchema,
          kyc_session: KycSessionPluginSchema,
          companySanctions: CompanySanctionsPluginSchema,
          merchantMonitoring: MerchantMonitoringPluginSchema,
          businessInformation: BusinessInformationPluginSchema,
          merchantScreening: MerchantScreeningPluginSchema,
        },
        { additionalProperties: true },
      ),
    ),
  }),
]);

export type DefaultContextSchema = Static<typeof defaultContextSchema>;
