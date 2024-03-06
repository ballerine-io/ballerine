import z from 'zod';
import { zodBuilder } from '@ballerine/common';
import { Prisma } from '@prisma/client';
import { zApprovalStateEnum } from '@/filter/dtos/temp-zod-schemas';

import { InputJsonValueSchema, RecordAnySchema } from '@/common/schemas';

export const BaseBusinessRelationships = zodBuilder<
  Pick<Prisma.BusinessCreateInput, 'workflowRuntimeData' | 'endUsers' | 'endUsersOnBusinesses'>
>()(
  z.object({
    workflowRuntimeData: RecordAnySchema.optional(),
    endUsers: z.array(RecordAnySchema).optional(),
    endUsersOnBusinesses: z.array(RecordAnySchema).optional(),
  }),
);

export const BaseBusinessCreateInputSchema = zodBuilder<
  Omit<Prisma.BusinessCreateInput, 'project' | 'endUsers' | 'endUsersOnBusinesses'>
>()(
  z.object({
    id: z.string().cuid().optional(),
    correlationId: z.string().optional(),
    businessType: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    companyName: z.string(),
    registrationNumber: z.string().optional(),
    legalForm: z.string().optional(),
    country: z.string().optional(),
    countryOfIncorporation: z.string().optional(),
    dateOfIncorporation: z.date().optional(),
    address: InputJsonValueSchema.optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().optional(),
    taxIdentificationNumber: z.string().optional(),
    vatNumber: z.string().optional(),
    shareholderStructure: InputJsonValueSchema.optional(),
    numberOfEmployees: z.number().optional(),
    businessPurpose: z.string().optional(),
    documents: InputJsonValueSchema.optional(),
    avatarUrl: z.string().optional(),
    additionalInfo: InputJsonValueSchema.optional(),
    bankInformation: InputJsonValueSchema.optional(),
    approvalState: zApprovalStateEnum.optional(),
  }),
);
export const BusinessCheckedCreateInputSchema = zodBuilder<Prisma.BusinessCreateInput>()(
  BaseBusinessCreateInputSchema.merge(BaseBusinessRelationships).extend({
    project: RecordAnySchema,
  }),
);
export const BusinessUncheckedCreateInputSchema = zodBuilder<Prisma.BusinessUncheckedCreateInput>()(
  BaseBusinessCreateInputSchema.merge(BaseBusinessRelationships).extend({
    projectId: z.string(),
  }),
);
export const BusinessCreateInputSchema = z.union([
  BusinessCheckedCreateInputSchema,
  BusinessUncheckedCreateInputSchema,
]);
