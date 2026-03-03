import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import qs from 'qs';
import { ASSESSMENT_STATUSES, ASSESSMENT_STATUSES_MAP } from '@ballerine/common';

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

export const KybAndOwnershipAssessmentsSchema = z.object({
  data: z.array(KybAndOwnershipAssessmentSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export interface IKybAndOwnershipAssessmentsParams extends PaginationParams {
  status?: string[];
  from?: string;
  to?: string;
}

export interface IKybAndOwnershipAssessmentParams {
  id: string;
}

export type TKybAndOwnershipAssessments = z.infer<typeof KybAndOwnershipAssessmentsSchema>;

export const fetchKybAndOwnershipAssessment = async (id: string) => {
  const [result, error] = await apiClient({
    endpoint: `../external/assessments/kyb_and_ownership/${id}`,
    method: Method.GET,
    schema: KybAndOwnershipAssessmentSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};

export const fetchKybAndOwnershipAssessments = async (
  params: IKybAndOwnershipAssessmentsParams,
) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [result, error] = await apiClient({
    endpoint: `../external/assessments/kyb_and_ownership?${queryParams}`,
    method: Method.GET,
    schema: KybAndOwnershipAssessmentsSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};

const CreateKybAndOwnershipAssessmentSchema = z.object({
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
    body: {
      type: 'kyb_and_ownership',
      ...payload,
    },
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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
  data: z.record(z.unknown()).optional(),
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
  workflowRuntimeDataId?: string;
  entityId?: string;
}

export type TIdentityVerificationAssessment = z.infer<typeof IdentityVerificationAssessmentSchema>;

export type TIdentityVerificationAssessments = z.infer<
  typeof IdentityVerificationAssessmentsSchema
>;

export interface IIdentityVerificationAssessmentParams {
  id: string;
}

const CreateIdentityVerificationAssessmentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  country: z.string(),
  state: z.string().optional(),
  dateOfBirth: z.string().date(),
});

const CreateIdentityVerificationAssessmentResponseSchema = z.object({
  id: z.string(),
});

export type TCreateIdentityVerificationAssessmentPayload = z.infer<
  typeof CreateIdentityVerificationAssessmentSchema
>;
export type TCreateIdentityVerificationAssessmentResponse = z.infer<
  typeof CreateIdentityVerificationAssessmentResponseSchema
>;

export const createIdentityVerificationAssessment = async (
  payload: TCreateIdentityVerificationAssessmentPayload,
) => {
  const [result, error] = await apiClient({
    endpoint: `identity-verification/assessments`,
    method: Method.POST,
    body: payload,
    schema: CreateIdentityVerificationAssessmentResponseSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};

export const fetchIdentityVerificationAssessment = async (id: string) => {
  const [result, error] = await apiClient({
    endpoint: `identity-verification/assessments/${id}`,
    method: Method.GET,
    schema: IdentityVerificationAssessmentSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};

export const fetchIdentityVerificationAssessments = async (
  params: IIdentityVerificationAssessmentsParams,
) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [result, error] = await apiClient({
    endpoint: `identity-verification/assessments?${queryParams}`,
    method: Method.GET,
    schema: IdentityVerificationAssessmentsSchema,
    timeout: 30_000,
  });

  return handleZodError(error, result);
};
