import { z } from 'zod';
import { apiClient } from '../../common/api-client/api-client';
import { Method } from '../../common/enums';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';

const CustomerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    logoImageUri: z.union([z.string(), z.null()]).optional(),
    // Remove default once data migration is done
    faviconImageUri: z.string().default(''),
    customerStatus: z.string().optional(),
    country: z.union([z.string(), z.null()]).optional(),
    language: z.union([z.string(), z.null()]).optional(),
  })
  .optional();

export type TCustomer = z.infer<typeof CustomerSchema>;

export const fetchCustomer = async () => {
  const [filter, error] = await apiClient({
    endpoint: `customers`,
    method: Method.GET,
    schema: CustomerSchema,
  });

  return handleZodError(error, filter);
};
