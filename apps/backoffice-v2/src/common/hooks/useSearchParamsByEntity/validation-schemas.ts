import { z } from 'zod';
import { CaseStatuses, States } from '../../enums';

export const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch('desc'),
  pageSize: z.coerce.number().int().positive().catch(10),
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().catch(''),
  filterId: z.string().catch(''),
  filterName: z.string().catch(''),
  entity: z.string().catch(''),
});
export const IndividualsSearchSchema = SearchSchema.extend({
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'phone', 'caseCreatedAt', 'approvalState'])
    .catch('caseCreatedAt'),
  filter: z
    .object({
      approvalState: z.array(z.enum(States)).catch([]),
      assigneeId: z.array(z.string().or(z.null())).catch([]),
      caseStatus: z.array(z.enum(CaseStatuses)).catch([]),
    })
    .catch({
      approvalState: [],
      assigneeId: [],
      caseStatus: [],
    }),
});
export const BusinessesSearchSchema = SearchSchema.extend({
  sortBy: z.enum(['caseCreatedAt', 'companyName']).optional().catch('caseCreatedAt'),
  filter: z
    .object({
      assigneeId: z.array(z.string().or(z.null())).catch([]),
      caseStatus: z.array(z.enum(CaseStatuses)).catch([]),
    })
    .catch({
      assigneeId: [],
      caseStatus: [],
    }),
});
