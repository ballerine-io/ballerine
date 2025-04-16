import { z } from 'zod';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

const createBusinessReportOptions = z.object({
  type: z.enum(['MERCHANT_REPORT_T1', 'MERCHANT_REPORT_T1_LITE']),
  version: z.enum(['1', '2', '3']),
});

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  logoImageUri: z.union([z.string(), z.null()]).optional(),
  // Remove default once data migration is done
  faviconImageUri: z.string().default(''),
  customerStatus: z.string().optional(),
  country: z.union([z.string(), z.null()]).optional(),
  language: z.union([z.string(), z.null()]).optional(),
  features: z
    .object({
      chatbot: z
        .object({ enabled: z.boolean().default(false), clientId: z.string().optional() })
        .optional(),
      createBusinessReport: z
        .object({ enabled: z.boolean().default(false), options: createBusinessReportOptions })
        .optional(),
      createBusinessReportBatch: z
        .object({ enabled: z.boolean().default(false), options: createBusinessReportOptions })
        .optional(),
      isDocumentOcrEnabled: z.boolean().default(false).optional(),
    })
    .nullable(),
  config: z
    .object({
      isMerchantMonitoringEnabled: z.boolean().default(false),
      isOngoingMonitoringEnabled: z.boolean().default(false),
      isCasesOnboardingEnabled: z.boolean().default(false),
      isExample: z.boolean().default(false),
      isDemoAccount: z.boolean().default(false),
      demoAccessDetails: z
        .object({
          totalReports: z.number(),
          expiresAt: z.number().nullish(),
          maxBusinessReports: z.number().default(10).nullish(),
          seenWelcomeModal: z.boolean().default(true).optional(),
          reportsLeft: z.number().nullish(),
          demoDaysLeft: z.number().nullish(),
        })
        .optional(),
    })
    .nullable()
    .default({
      isMerchantMonitoringEnabled: false,
      isOngoingMonitoringEnabled: false,
      isCasesOnboardingEnabled: false,
      isExample: false,
    }),
});

export type TCustomer = z.infer<typeof CustomerSchema>;

export const fetchCustomer = async () => {
  const [customer, error] = await apiClient({
    endpoint: `../external/customers/by-current-project-id`,
    method: Method.GET,
    schema: CustomerSchema,
  });

  return handleZodError(error, customer);
};
