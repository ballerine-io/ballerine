import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';
import qs from 'qs';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';

export const KybAndUbosCheckStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'in-progress',
]);

export const KybAndUbosCheckSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  registrationNumber: z.string(),
  country: z.string(),
  state: z.string().optional(),
  merchantId: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  findings: z.array(z.string()),
  status: KybAndUbosCheckStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  isExample: z.boolean().optional(),
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
  const queryParams = qs.stringify(params, { encode: false });

  const response = await apiClient({
    endpoint: `checks/kyb_and_ownership?${queryParams}`,
    method: Method.GET,
    schema: KybAndUbosChecksSchema,
    timeout: 30_000,
  });

  return KybAndUbosChecksSchema.parse(response);

  // Mock response with 10 items and 500ms delay
  // return new Promise<TKybAndUbosChecks>(resolve => {
  //   setTimeout(() => {
  //     const riskLevels: Array<TKybAndUbosCheck['riskLevel']> = [
  //       'low',
  //       'medium',
  //       'high',
  //       'critical',
  //     ];
  //     const statuses: Array<TKybAndUbosCheck['status']> = [
  //       'pending',
  //       'approved',
  //       'rejected',
  //       'in-progress',
  //     ];
  //     const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Canada'];

  //     const mockData = Array.from({ length: 10 }, (_, index) => ({
  //       id: `check-${index + 1}`,
  //       companyName: `Company ${index + 1}`,
  //       registrationNumber: `REG${100000 + index}`,
  //       country: countries[index % countries.length],
  //       state: index % 3 === 0 ? 'California' : undefined,
  //       merchantId: `MERCH-${1000 + index}`,
  //       riskLevel: riskLevels[index % riskLevels.length],
  //       findings: Array.from({ length: (index % 5) + 1 }, (_, i) => `Finding ${i + 1}`),
  //       status: statuses[index % statuses.length],
  //       createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  //       updatedAt: new Date(Date.now() - index * 43200000).toISOString(),
  //       isExample: index < 3 ? true : undefined,
  //     }));

  //     resolve({
  //       data: mockData,
  //       totalItems: 10,
  //       totalPages: 1,
  //     });
  //   }, 500);
  // });
};
