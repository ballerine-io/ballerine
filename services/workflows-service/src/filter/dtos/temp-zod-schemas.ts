import { z } from 'zod';

export const zQueryModeEnum = z.enum(['Default', 'Insensitive']);
export const zApprovalStateEnum = z.enum(['APPROVED', 'REJECTED', 'PROCESSING', 'NEW']);
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
  equals: z.string().nullable().optional(),
  in: z.array(z.string()).nullable().optional(),
  notIn: z.array(z.string()).nullable().optional(),
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
export const DateTimeFilterSchema = z.object({
  equals: z.date().optional(),
  not: z.date().optional(),
  in: z.array(z.date()).optional(),
  notIn: z.array(z.date()).optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
});

export const zEnumerable = <T extends z.ZodType<any, any>>(schema: T) =>
  z.union([schema, schema.array()]);

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
