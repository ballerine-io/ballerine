import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import qs from 'qs';
import { MERCHANT_REPORT_STATUSES } from '@ballerine/common';

export const KybAndUbosCheckStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'in-progress',
]);

export const KybAndUbosCheckSchema = z
  .object({
    id: z.string(),
    status: z.enum(MERCHANT_REPORT_STATUSES).catch('failed'),
    type: z.literal('kyb_and_ownership'),
    createdAt: z.string(),
    input: z
      .object({
        companyName: z.string().nullable().optional(),
        businessId: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        registrationNumber: z.string().nullable().optional(),
      })
      .optional()
      .nullable(),
    // findings: z.array(z.string()).optional(),
    // riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    sanctions: z
      .object({
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        output: z
          .object({
            data: z.any().optional(),
          })
          .passthrough()
          .nullable(),
      })
      .passthrough()
      .nullable()
      .optional(),
    registryInformation: z
      .object({
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        output: z
          .object({
            data: z.any().optional(),
          })
          .passthrough()
          .nullable(),
      })
      .passthrough()
      .nullable()
      .optional(),
    companyStructure: z
      .object({
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        output: z.any().optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

export type TKybAndUbosCheck = z.infer<typeof KybAndUbosCheckSchema>;

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

export type TKybAndUbosChecks = z.infer<typeof KybAndUbosChecksSchema>;

export const fetchKybAndUbosChecks = async (params: IKybAndUbosChecksParams) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [result, error] = await apiClient({
    endpoint: `../external/checks/kyb_and_ownership?${queryParams}`,
    method: Method.GET,
    schema: KybAndUbosChecksSchema,
    timeout: 30_000,
  });

  if (error) {
    return handleZodError(error, result);
  }

  return KybAndUbosChecksSchema.parse(result);

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

interface ICreateKybAndUbosCheckPayload {
  companyName: string;
  registrationNumber: string;
  country: string;
  state: string;
  correlationId: string;
}

const CreateKybAndUbosCheckSchema = z.object({
  companyName: z.string(),
  registrationNumber: z.string(),
  country: z.string(),
  state: z.string(),
  correlationId: z.string(),
});

export type TCreateKybAndUbosCheckPayload = z.infer<typeof CreateKybAndUbosCheckSchema>;

export const createKybAndUbosCheck = async (payload: TCreateKybAndUbosCheckPayload) => {
  const [result, error] = await apiClient({
    endpoint: `../external/checks`,
    method: Method.POST,
    body: {
      type: 'kyb_and_ownership',
      ...payload,
    },
    schema: CreateKybAndUbosCheckSchema,
  });

  return handleZodError(error, result);
};

export const IdentityVerificationStatuses = ['pending', 'verified', 'rejected'] as const;

export const IdentityVerificationCheckSchema = z.object({
  id: z.string(),
  checkId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  data: z.object({}).optional(),
  verificationLink: z.string(),
  status: z.enum(IdentityVerificationStatuses),
  issues: z.array(z.string()).optional(),
});

export const IdentityVerificationChecksSchema = z.object({
  data: z.array(IdentityVerificationCheckSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export interface IIdentityVerificationChecksParams extends PaginationParams {
  status?: string[];
  from?: string;
  to?: string;
}

export type TIdentityVerificationCheck = z.infer<typeof IdentityVerificationCheckSchema>;

export type TIdentityVerificationChecks = z.infer<typeof IdentityVerificationChecksSchema>;

export const fetchIdentityVerificationChecks = async (
  params: IIdentityVerificationChecksParams,
) => {
  // Original implementation commented out
  // const queryParams = qs.stringify(params, { encode: false });
  //
  // const response = await apiClient({
  //   url: `/identity-verification/checks?${queryParams}`,
  //   method: 'GET',
  //   schema: IdentityVerificationChecksSchema,
  //   timeout: 30_000,
  // });
  //
  // return IdentityVerificationChecksSchema.parse(response);

  // Mock response with 10 items and 1 second delay
  return new Promise<TIdentityVerificationChecks>(resolve => {
    setTimeout(() => {
      const mockData = Array.from({ length: 10 }, (_, index) => ({
        id: `check-${index + 1}`,
        checkId: `verification-${index + 1}`,
        firstName: `John${index}`,
        lastName: `Doe${index}`,
        email: `john.doe${index}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: index % 5 === 0 ? new Date() : null,
        data: {},
        verificationLink: `https://verification.example.com/link-${index}`,
        status: index % 3 === 0 ? 'pending' : index % 3 === 1 ? 'verified' : 'rejected',
        issues: index % 2 === 0 ? [`Issue ${index}`] : [],
      }));

      resolve({
        data: mockData,
        totalItems: 10,
        totalPages: 1,
      });
    }, 500);
  });
};
