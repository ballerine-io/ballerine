import { z } from 'zod';

export const zQueryModeEnum = z.enum(['Default', 'Insensitive']);

export const zEnumerable = <T extends z.ZodType<any, any>>(schema: T) =>
  z.union([schema, schema.array()]);

// @ts-expect-error - It is expected for z.lazy to be any.
const NestedIntNullableFilter = z.lazy(() =>
  z.object({
    equals: z.number().nullable().optional(),
    in: zEnumerable(z.number()).optional(),
    notIn: zEnumerable(z.number()).optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([NestedIntNullableFilter, z.number().nullable()]).optional(),
  }),
);

// @ts-expect-error - It is expected for z.lazy to be any.
const NestedIntFilter = z.lazy(() =>
  z.object({
    equals: z.number().optional(),
    in: zEnumerable(z.number()).optional(),
    notIn: zEnumerable(z.number()).optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([NestedIntFilter, z.number()]).optional(),
  }),
);

const IntNullableFilterSchema = z.object({
  equals: z.number().nullable().optional(),
  in: zEnumerable(z.number()).optional(),
  notIn: zEnumerable(z.number()).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([NestedIntNullableFilter, z.number().nullable()]).optional(),
});

export const StringFilterSchema = z.object({
  equals: z.string().optional(),
  in: z.array(z.string()).optional(),
  notIn: z.array(z.string()).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: zQueryModeEnum.optional(),
  not: z.string().optional(),
});

export const StringNullableFilterSchema = z.object({
  equals: z.string().optional().nullable(),
  in: z.array(z.string()).optional().nullable(),
  notIn: z.array(z.string()).optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: zQueryModeEnum.optional(),
  not: z.string().optional().nullable(),
});
export const DateTimeFilterSchema = z.object({
  equals: z.date().optional(),
  in: z.array(z.date()).optional(),
  notIn: z.array(z.date()).optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
  not: z.date().optional(),
});

export const DateTimeNullableFilterSchema = z.object({
  equals: z.date().optional().nullable(),
  in: z.array(z.date()).optional().nullable(),
  notIn: z.array(z.date()).optional().nullable(),
  not: z.date().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
});

/* End-users */

export const zApprovalStateEnum = z.enum(['APPROVED', 'REJECTED', 'PROCESSING', 'NEW']);

// @ts-expect-error - It is expected for z.lazy to be any.
export const NestedEnumApprovalStateFilter = z.lazy(() =>
  z.object({
    equals: zApprovalStateEnum.optional(),
    in: zEnumerable(zApprovalStateEnum).optional(),
    notIn: zEnumerable(zApprovalStateEnum).optional(),
    not: z.union([NestedEnumApprovalStateFilter, zApprovalStateEnum]).optional(),
  }),
);

export const EnumApprovalStateFilter = z.object({
  equals: zApprovalStateEnum.optional(),
  in: zEnumerable(zApprovalStateEnum).optional(),
  notIn: zEnumerable(zApprovalStateEnum).optional(),
  not: z.union([NestedEnumApprovalStateFilter, zApprovalStateEnum]).optional(),
});

export const EndUserWhereInputSchema = z.object({
  correlationId: StringFilterSchema.optional(),
  verificationId: StringNullableFilterSchema.optional(),
  endUserType: StringNullableFilterSchema.optional(),
  approvalState: EnumApprovalStateFilter.optional(),
  stateReason: StringNullableFilterSchema.optional(),
  firstName: StringNullableFilterSchema.optional(),
  lastName: StringNullableFilterSchema.optional(),
  email: StringNullableFilterSchema.optional(),
  phone: StringNullableFilterSchema.optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional(),
});

export const EndUserSelectSchema = z.object({
  id: z.boolean().optional(),
  correlationId: z.boolean().optional(),
  verificationId: z.boolean().optional(),
  endUserType: z.boolean().optional(),
  approvalState: z.boolean().optional(),
  stateReason: z.boolean().optional(),
  jsonData: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  dateOfBirth: z.boolean().optional(),
  avatarUrl: z.boolean().optional(),
  additionalInfo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workflowRuntimeData: z.boolean().optional(),
  businesses: z.boolean().optional(),
  EndUsersOnBusinesses: z.boolean().optional(),
  _count: z.boolean().optional(),
});

export const EndUserFilterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  entity: z.string(),
  query: z
    .object({
      select: EndUserSelectSchema.strict().optional(),
      where: EndUserWhereInputSchema.strict().optional(),
    })
    .refine(v => v.select || v.where, 'At least `query.select` or `query.where` must be provided'),
  createdBy: z.string().default('SYSTEM'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const EndUserFilterCreateSchema = EndUserFilterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/* Businesses */

export const BusinessSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  companyName: z.boolean().optional(),
  registrationNumber: z.boolean().optional(),
  legalForm: z.boolean().optional(),
  countryOfIncorporation: z.boolean().optional(),
  dateOfIncorporation: z.boolean().optional(),
  address: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  email: z.boolean().optional(),
  website: z.boolean().optional(),
  industry: z.boolean().optional(),
  taxIdentificationNumber: z.boolean().optional(),
  vatNumber: z.boolean().optional(),
  shareholderStructure: z.boolean().optional(),
  numberOfEmployees: z.boolean().optional(),
  businessPurpose: z.boolean().optional(),
  documents: z.boolean().optional(),
  approvalState: z.boolean().optional(),
  _count: z.boolean().optional(),
});

export const BusinessWhereInputSchema = z.object({
  companyName: StringFilterSchema.optional(),
  registrationNumber: StringFilterSchema.optional(),
  legalForm: StringFilterSchema.optional(),
  countryOfIncorporation: StringFilterSchema.optional(),
  dateOfIncorporation: DateTimeNullableFilterSchema.optional(),
  address: StringFilterSchema.optional(),
  phoneNumber: StringNullableFilterSchema.optional(),
  email: StringNullableFilterSchema.optional(),
  website: StringNullableFilterSchema.optional(),
  industry: StringFilterSchema.optional(),
  taxIdentificationNumber: StringNullableFilterSchema.optional(),
  vatNumber: StringNullableFilterSchema.optional(),
  shareholderStructure: z.unknown().optional(),
  numberOfEmployees: IntNullableFilterSchema.optional(),
  businessPurpose: StringNullableFilterSchema.optional(),
  documents: z.unknown().optional(),
  approvalState: z.union([EnumApprovalStateFilter, zApprovalStateEnum]).optional(),
  createdAt: DateTimeFilterSchema.optional(),
  updatedAt: DateTimeFilterSchema.optional(),
});

export const BusinessFilterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  entity: z.string(),
  query: z
    .object({
      select: EndUserSelectSchema.strict().optional(),
      where: EndUserWhereInputSchema.strict().optional(),
    })
    .refine(v => v.select || v.where, 'At least `query.select` or `query.where` must be provided'),
  createdBy: z.string().default('SYSTEM'),
  createdAt: z.date(),
  updatedAt: z.date(),
});
