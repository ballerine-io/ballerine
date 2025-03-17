import { apiClient } from '@/common/api-client/api-client';

import { Method } from '@/common/enums';

import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

export const translateUiDefinition = async ({
  id,
  partialUiDefinition,
  locale,
}: {
  id: string;
  partialUiDefinition: Record<string, unknown>;
  locale: string;
}) => {
  const [data, error] = await apiClient({
    endpoint: `../case-management/ui-definition/${id}/translate/${locale}`,
    method: Method.POST,
    body: {
      partialUiDefinition,
    },
    schema: z.record(z.string(), z.unknown()),
  });

  return handleZodError(error, data);
};
