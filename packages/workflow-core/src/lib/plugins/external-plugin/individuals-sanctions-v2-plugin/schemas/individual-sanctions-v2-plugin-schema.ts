import { z } from 'zod';

const dateSchema = z.preprocess(arg => {
  if (typeof arg === 'string' || arg instanceof Date) {
    const date = new Date(arg);

    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    }
  }

  return arg;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'));

export const KycInformationSchemaWithAdditionalInfo = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: dateSchema.optional(),
  additionalInfo: z
    .object({
      dateOfBirth: dateSchema.optional(),
    })
    .optional(),
});

export const IndividualsSanctionsV2PluginPayloadSchema = z.object({
  vendor: z.enum(['veriff', 'test', 'dow-jones']),
  ongoingMonitoring: z.boolean(),
  immediateResults: z.boolean(),
  workflowRuntimeId: z.string().min(1),
  kycInformation: z.union([
    z.record(
      z.union([z.string(), z.number(), z.symbol()]),
      z.object({
        result: z.object({
          vendorResult: z.object({
            entity: z.object({
              data: KycInformationSchemaWithAdditionalInfo,
            }),
          }),
        }),
      }),
    ),
    KycInformationSchemaWithAdditionalInfo,
    z.array(KycInformationSchemaWithAdditionalInfo),
  ]),
  endUserId: z.string().min(1),
  clientId: z.string().min(1),
  resultDestination: z
    .string()
    .min(1)
    // TODO: proabably can be kept undefined and let the parent class handle it, for now keeping our old path as default
    .default('pluginsOutput.kyc_session.kyc_session_1.result.aml'),
});
