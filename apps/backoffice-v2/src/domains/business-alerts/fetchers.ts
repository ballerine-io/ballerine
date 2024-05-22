import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { env } from '@/common/env/env';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { AlertItemSchema, TAlertState } from '@/domains/alerts/fetchers';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import qs from 'qs';
import { z } from 'zod';

export const BusinessAlertItem = AlertItemSchema.extend({
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

export const BusinessAlertsListSchema = z.array(BusinessAlertItem);

export type TBusinessAlertItem = z.output<typeof BusinessAlertItem>;
export type TBusinessAlertsList = z.output<typeof BusinessAlertsListSchema>;
export type AlertEntityType = 'transaction' | 'business';

export const fetchBusinessAlerts = async (params: {
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
  entityType: AlertEntityType;
}) => {
  const queryParams = qs.stringify(params, { encode: false });
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/business-report?${queryParams}`,
    method: Method.GET,
    schema: BusinessAlertsListSchema,
  });

  return handleZodError(error, alerts);
};

export const assignAlertsByIds = async ({
  assigneeId,
  alertIds,
}: {
  assigneeId: string | null;
  alertIds: string[];
}) => {
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/assign`,
    method: Method.PATCH,
    body: {
      assigneeId,
      alertIds,
    },
    schema: z.any(),
  });

  return handleZodError(error, alerts);
};

export const updateAlertsDecisionByIds = async ({
  decision,
  alertIds,
}: {
  decision: TAlertState;
  alertIds: string[];
}) => {
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/decision`,
    method: Method.PATCH,
    body: {
      decision,
      alertIds,
    },
    schema: z.any(),
  });

  return handleZodError(error, alerts);
};

export const AlertDefinitionByAlertIdSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const fetchAlertDefinitionByAlertId = async ({ alertId }: { alertId: string }) => {
  const [alertDefinition, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/${alertId}/alert-definition`,
    method: Method.GET,
    schema: AlertDefinitionByAlertIdSchema,
  });

  return handleZodError(error, alertDefinition);
};

export const AlertLabelsSchema = z.array(z.string());

export const fetchAlertLabels = async () => {
  const [alertDefinition, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/internal/alerts/labels`,
    method: Method.GET,
    schema: AlertLabelsSchema,
  });

  return handleZodError(error, alertDefinition);
};
