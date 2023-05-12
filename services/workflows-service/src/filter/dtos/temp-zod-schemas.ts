/**
 * Before getting rid of this file we need to;
 * 1. Generate Zod schemas from json-schema or Prisma
 * 2. Generate Swagger docs from json-schema or Zod schemas
 * 3. Replace instances of class-validator and class-transformer with Zod
 */

import { z, ZodSchema } from 'zod';

export const zQueryModeEnum = z.enum(['Default', 'Insensitive']);

export const zEnumerable = <TSchema>(schema: ZodSchema<TSchema>) =>
  z.union([schema, schema.array()]);

// @ts-expect-error - It is expected for z.lazy to be any.
export const NestedIntFilterSchema = z.lazy(() =>
  z.object({
    equals: z.number().optional(),
    in: zEnumerable(z.number()).optional(),
    notIn: zEnumerable(z.number()).optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([NestedIntFilterSchema, z.number()]).optional(),
  }),
);

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

export const zDateTimeFilterDateStringUnion = z.union([
  DateTimeFilterSchema.strict(),
  z.date(),
  z.string(),
]);

export const zDateTimeNullableFilterDateStringUnion = z.union([
  DateTimeNullableFilterSchema.strict(),
  z.date(),
  z.string(),
  z.null(),
]);

export const FilterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  entity: z.string(),
  createdBy: z.string().default('SYSTEM'),
  createdAt: zDateTimeFilterDateStringUnion,
  updatedAt: zDateTimeFilterDateStringUnion,
});

export const zStringFilterStringUnion = z.union([StringFilterSchema.strict(), z.string()]);

export const zStringNullableFilterStringNullUnion = z.union([
  StringNullableFilterSchema.strict(),
  z.string(),
  z.null(),
]);

// @ts-expect-error - It is expected for z.lazy to be any.
export const NestedIntNullableFilterSchema = z.lazy(() =>
  z
    .object({
      equals: z.number().optional().nullable(),
      in: zEnumerable(z.number()).optional().nullable(),
      notIn: zEnumerable(z.number()).optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z.union([NestedIntNullableFilterSchema, z.number(), z.null()]).optional().nullable(),
    })
    .strict(),
);

export const IntNullableFilterSchema = z.lazy(() =>
  z
    .object({
      equals: z.number().optional().nullable(),
      in: zEnumerable(z.number()).optional().nullable(),
      notIn: zEnumerable(z.number()).optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z.union([NestedIntNullableFilterSchema, z.number(), z.null()]).optional().nullable(),
    })
    .strict(),
);

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

export const EndUserWhereInputSchema = z.object({
  id: zStringFilterStringUnion.optional(),
  correlationId: zStringFilterStringUnion.optional(),
  verificationId: zStringNullableFilterStringNullUnion.optional(),
  endUserType: zStringNullableFilterStringNullUnion.optional(),
  approvalState: z.union([NestedEnumApprovalStateFilter, zApprovalStateEnum]).optional(),
  stateReason: zStringNullableFilterStringNullUnion.optional(),
  firstName: zStringNullableFilterStringNullUnion.optional(),
  lastName: zStringNullableFilterStringNullUnion.optional(),
  email: zStringNullableFilterStringNullUnion.optional(),
  phone: zStringNullableFilterStringNullUnion.optional(),
  dateOfBirth: zDateTimeNullableFilterDateStringUnion.optional(),
  avatarUrl: zStringNullableFilterStringNullUnion.optional(),
  createdAt: zDateTimeFilterDateStringUnion.optional(),
  updatedAt: zDateTimeFilterDateStringUnion.optional(),
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
  endUsersOnBusinesses: z.boolean().optional(),
  _count: z.boolean().optional(),
});

export const EndUserFilterSchema = FilterSchema.extend({
  query: z
    .object({
      select: EndUserSelectSchema.strict()
        .refine(v => Object.keys(v).length > 0, 'At least one `select` field must be provided')
        .optional(),
      where: EndUserWhereInputSchema.strict().optional(),
    })
    .refine(v => v.select || v.where, 'At least `query.select` or `query.where` must be provided'),
});

export const EndUserFilterCreateSchema = EndUserFilterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/* Businesses */

export const BusinessSelectSchema = z.object({
  id: z.boolean().optional(),
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
  workflowRuntimeData: z.boolean().optional(),
  endUsers: z.boolean().optional(),
  endUsersOnBusinesses: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.boolean().optional(),
});

export const BusinessWhereInputSchema = z.object({
  id: zStringFilterStringUnion.optional(),
  companyName: zStringFilterStringUnion.optional(),
  registrationNumber: zStringFilterStringUnion.optional(),
  legalForm: zStringFilterStringUnion.optional(),
  countryOfIncorporation: zStringFilterStringUnion.optional(),
  dateOfIncorporation: zDateTimeNullableFilterDateStringUnion.optional(),
  address: zStringFilterStringUnion.optional(),
  phoneNumber: zStringNullableFilterStringNullUnion.optional(),
  email: zStringNullableFilterStringNullUnion.optional(),
  website: zStringNullableFilterStringNullUnion.optional(),
  industry: zStringFilterStringUnion.optional(),
  taxIdentificationNumber: zStringNullableFilterStringNullUnion.optional(),
  vatNumber: zStringNullableFilterStringNullUnion.optional(),
  numberOfEmployees: z.union([IntNullableFilterSchema, z.number(), z.null()]).optional(),
  businessPurpose: zStringNullableFilterStringNullUnion.optional(),
  approvalState: z.union([NestedEnumApprovalStateFilter, zApprovalStateEnum]).optional(),
  createdAt: zDateTimeFilterDateStringUnion.optional(),
  updatedAt: zDateTimeFilterDateStringUnion.optional(),
});

export const BusinessFilterSchema = FilterSchema.extend({
  query: z
    .object({
      select: BusinessSelectSchema.strict()
        .refine(v => Object.keys(v).length > 0, 'At least one `select` field must be provided')
        .optional(),
      where: BusinessWhereInputSchema.strict().optional(),
    })
    .refine(v => v.select || v.where, 'At least `query.select` or `query.where` must be provided'),
});

export const BusinessFilterCreateSchema = BusinessFilterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
