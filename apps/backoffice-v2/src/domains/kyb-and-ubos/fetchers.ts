import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';

export const KybAndUbosCheckSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
});

export const KybAndUbosChecksSchema = z.object({
  data: z.array(KybAndUbosCheckSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export interface IKybAndUbosChecksParams extends PaginationParams {
  status?: string[];
  from?: string;
  to?: string;
}

export type TKybAndUbosCheck = z.infer<typeof KybAndUbosCheckSchema>;

export type TKybAndUbosChecks = z.infer<typeof KybAndUbosChecksSchema>;

export const fetchKybAndUbosChecks = async (params: IKybAndUbosChecksParams) => {
  // Original implementation commented out
  // const queryParams = qs.stringify(params, { encode: false });
  //
  // const response = await apiClient({
  //   url: `/kyb-and-ubos/checks?${queryParams}`,
  //   method: 'GET',
  //   schema: KybAndUbosChecksSchema,
  //   timeout: 30_000,
  // });
  //
  // return KybAndUbosChecksSchema.parse(response);

  // Mock response with 10 items
  const mockData = Array.from({ length: 10 }, (_, index) => ({
    id: `check-${index + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: index % 3 === 0 ? 'completed' : index % 3 === 1 ? 'pending' : 'in-progress',
  }));

  return {
    data: mockData,
    totalItems: 10,
    totalPages: 1,
  };
};
