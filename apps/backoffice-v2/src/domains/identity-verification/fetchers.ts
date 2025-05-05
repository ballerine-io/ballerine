import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';

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
