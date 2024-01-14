import { z } from 'zod';
import { CaseStatus, CaseStatuses } from '../../enums';

export const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch('desc'),
  pageSize: z.coerce.number().int().positive().catch(50),
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().catch(''),
  filterId: z.string().catch(''),
  entity: z.string().catch(''),
});

const createFilterSchema = (authenticatedUserId: string) =>
  z
    .object({
      assigneeId: z.array(z.string().nullable()).catch([authenticatedUserId, null]),
      status: z.array(z.enum(CaseStatuses)).catch([CaseStatus.ACTIVE]),
      caseStatus: z.array(z.string()).catch([]),
    })
    .catch({
      assigneeId: [authenticatedUserId, null],
      status: [CaseStatus.ACTIVE],
      caseStatus: [],
    });

export const IndividualsSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt']).catch('createdAt'),
    filter: createFilterSchema(authenticatedUserId),
  });

export const BusinessesSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['createdAt', 'companyName']).catch('createdAt'),
    filter: createFilterSchema(authenticatedUserId),
  });
