import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { env } from '@/common/env/env';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { AlertSchema } from '@/domains/alerts/fetchers';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import qs from 'qs';
import { z } from 'zod';

export const BusinessAlert = AlertSchema.extend({
  subject: ObjectWithIdSchema.extend({
    companyName: z.string(),
    businessReports: z.any(),
  }),
  additionalInfo: z.object({
    alertReason: z.string(),
    businessCompanyName: z.string(),
    businessId: z.string(),
    previousRiskScore: z.number(),
    projectId: z.string(),
    reportId: z.string().optional(),
    riskScore: z.number(),
    severity: z.string(),
  }),
});

export const BusinessAlertsListSchema = z.array(BusinessAlert);

export type TBusinessAlert = z.output<typeof BusinessAlert>;

export type TBusinessAlerts = z.output<typeof BusinessAlertsListSchema>;

export const fetchBusinessAlerts = async (params: {
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
}) => {
  const queryParams = qs.stringify(params, { encode: false });
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/business-report?${queryParams}`,
    method: Method.GET,
    schema: BusinessAlertsListSchema,
  });

  return handleZodError(error, alerts);
};
