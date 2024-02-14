import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { z } from 'zod';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';

export const TransactionsListSchema = z.array(
  ObjectWithIdSchema.extend({
    transactionDate: z.string().datetime(),
    // direction: z.enum(['inbound', 'outbound'] as const),
    transactionAmount: z.number(),
    // business: z.string(),
    businessId: z.string().nullable(),
    // counterPartyName: z.string(),
    // counterPartyId: z.string(),
    // counterPartyInstitution: z.string(),
  }),
);

export type TTransactionsList = z.output<typeof TransactionsListSchema>;

export const fetchTransactions = async () => {
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/transactions`,
    method: Method.GET,
    schema: TransactionsListSchema,
  });

  return handleZodError(error, alerts);
};
