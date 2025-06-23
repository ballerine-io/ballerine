import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import qs from 'qs';
import { ASSESSMENT_STATUSES, ASSESSMENT_STATUSES_MAP } from '@ballerine/common';
import { snakeCase } from 'lodash-es';

export const KybAndOwnershipAssessmentSchema = z
  .object({
    id: z.string(),
    status: z.enum(ASSESSMENT_STATUSES).catch(ASSESSMENT_STATUSES_MAP['in-progress']),
    type: z.literal('kyb_and_ownership'),
    createdAt: z.string(),
    input: z
      .object({
        companyName: z.string(),
        country: z.string(),
        registrationNumber: z.string(),
        businessId: z.string().nullable().optional(),
      })
      .optional()
      .nullable(),
    companySanctions: z
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
    companyRegistryInformation: z
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

export type TKybAndOwnershipAssessment = z.infer<typeof KybAndOwnershipAssessmentSchema>;

export const AssessmentsSchema = z.object({
  data: z.array(KybAndOwnershipAssessmentSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export type IAssessmentType = 'kyb_and_ownership' | 'company_sanctions';

export interface IAssessmentsParams extends PaginationParams {
  status?: string[];
  from?: string;
  to?: string;
}

export interface IKybAndOwnershipAssessmentParams {
  id: string;
}

export type TKybAndOwnershipAssessments = z.infer<typeof AssessmentsSchema>;

export const fetchAssessment = async (id: string) => {
  const [result, error] = await apiClient({
    endpoint: `../external/assessments/by-id/${id}`,
    method: Method.GET,
    schema: KybAndOwnershipAssessmentSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};

export const fetchAssessments = async (type: IAssessmentType, params: IAssessmentsParams) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [result, error] = await apiClient({
    endpoint: `../external/assessments/${snakeCase(type)}?${queryParams}`,
    method: Method.GET,
    schema: AssessmentsSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};

export const assessmentEnumSchema = z.enum(['kyb_and_ownership', 'company_sanctions']);

export const CreateKybAndOwnershipAssessmentSchema = z.object({
  type: assessmentEnumSchema,
  companyName: z.string(),
  registrationNumber: z.string(),
  country: z.string(),
  state: z.string(),
  businessId: z.string().optional(),
});

const CreateKybAndOwnershipAssessmentResponseSchema = z.object({
  id: z.string(),
});

export type TCreateKybAndOwnershipAssessmentPayload = z.infer<
  typeof CreateKybAndOwnershipAssessmentSchema
>;

export const createKybAndOwnershipAssessment = async (
  payload: TCreateKybAndOwnershipAssessmentPayload,
) => {
  const [result, error] = await apiClient({
    endpoint: `../external/assessments`,
    method: Method.POST,
    body: payload,
    schema: CreateKybAndOwnershipAssessmentResponseSchema,
  });

  return handleZodError(error, result);
};

export const IdentityVerificationStatuses = ['pending', 'verified', 'rejected'] as const;

export const IdentityVerificationAssessmentSchema = z.object({
  id: z.string(),
  assessmentId: z.string(),
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

export const IdentityVerificationAssessmentsSchema = z.object({
  data: z.array(IdentityVerificationAssessmentSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export interface IIdentityVerificationAssessmentsParams extends PaginationParams {
  status?: string[];
  from?: string;
  to?: string;
}

export type TIdentityVerificationAssessment = z.infer<typeof IdentityVerificationAssessmentSchema>;

export type TIdentityVerificationAssessments = z.infer<
  typeof IdentityVerificationAssessmentsSchema
>;

export const fetchIdentityVerificationAssessments = async (
  params: IIdentityVerificationAssessmentsParams,
) => {
  const queryParams = qs.stringify(params, { encode: false });

  const response = await apiClient({
    url: `/identity-verification/assessments?${queryParams}`,
    method: Method.GET,
    schema: IdentityVerificationAssessmentsSchema,
    timeout: 30_000,
  });

  return IdentityVerificationAssessmentsSchema.parse(response);
};
