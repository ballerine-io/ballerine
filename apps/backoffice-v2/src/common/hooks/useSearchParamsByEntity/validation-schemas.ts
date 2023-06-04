import { z } from 'zod';
import { CaseStatus, CaseStatuses, States } from '../../enums';

export const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch('desc'),
  pageSize: z.coerce.number().int().positive().catch(10),
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().catch(''),
  filterId: z.string().catch(''),
  filterName: z.string().catch(''),
  entity: z.string().catch(''),
});
export const IndividualsSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z
      .enum(['firstName', 'lastName', 'email', 'phone', 'caseCreatedAt', 'approvalState'])
      .catch('caseCreatedAt'),
    filter: z
      .object({
        approvalState: z.array(z.enum(States)).optional().catch([]),
        assigneeId: z.array(z.string().nullable()).optional().catch([authenticatedUserId, null]),
        caseStatus: z.array(z.enum(CaseStatuses)).optional().catch([CaseStatus.ACTIVE]),
      })
      .catch({
        approvalState: [],
        assigneeId: [authenticatedUserId, null],
        caseStatus: [CaseStatus.ACTIVE],
      }),
  });
export const BusinessesSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['caseCreatedAt', 'companyName']).catch('caseCreatedAt'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).optional().catch([authenticatedUserId, null]),
        caseStatus: z.array(z.enum(CaseStatuses)).optional().catch([CaseStatus.ACTIVE]),
      })
      .catch({
        assigneeId: [authenticatedUserId, null],
        caseStatus: [CaseStatus.ACTIVE],
      }),
  });
