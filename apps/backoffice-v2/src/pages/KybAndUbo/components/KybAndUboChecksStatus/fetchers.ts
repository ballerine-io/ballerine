import { z } from 'zod';
import { UpdateableReportStatus } from '@ballerine/common';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const updateReportStatus = async ({
  reportId,
  status,
}: {
  reportId: string;
  status: UpdateableReportStatus;
}) => {
  const [data, error] = await apiClient({
    endpoint: `../external/business-reports/${reportId}/status/${status}`,
    method: Method.PUT,
    schema: z.object({
      reportId: z.string(),
      status: z.string(),
    }),
    timeout: 300_000,
  });

  return handleZodError(error, data);
};
