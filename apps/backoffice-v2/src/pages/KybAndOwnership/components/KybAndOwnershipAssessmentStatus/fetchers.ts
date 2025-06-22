import { z } from 'zod';
import { UpdateableAssessmentStatus } from '@ballerine/common';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

export const updateAssessmentStatus = async ({
  assessmentId,
  status,
}: {
  assessmentId: string;
  status: UpdateableAssessmentStatus;
}) => {
  const [data, error] = await apiClient({
    endpoint: `../external/assessments/${assessmentId}/status`,
    method: Method.PUT,
    body: {
      status,
    },
    schema: z.object({
      id: z.string(),
      status: z.string(),
    }),
    timeout: 300_000,
  });

  return handleZodError(error, data);
};
