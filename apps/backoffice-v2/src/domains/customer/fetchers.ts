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
      createBusinessReport: z
        .object({ enabled: z.boolean().default(false), options: createBusinessReportOptions })
        .optional(),
      createBusinessReportBatch: z
        .object({ enabled: z.boolean().default(false), options: createBusinessReportOptions })
        .optional(),
    })
    .nullable(),
  config: z
    .object({
      isMerchantMonitoringEnabled: z.boolean().default(false),
      isExample: z.boolean().default(false),
      isDemo: z.boolean().default(false),
      isChatbotEnabled: z.boolean().default(false),
    })
    .nullable()
    .default({
      isMerchantMonitoringEnabled: false,
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
