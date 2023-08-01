import { z } from 'zod';
import {
  CaseStatus,
  CaseStatuses,
  DocumentDecisionStatus,
  DocumentDecisionStatuses,
} from '../../enums';

export const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch('desc'),
  pageSize: z.coerce.number().int().positive().catch(50),
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().catch(''),
  filterId: z.string().catch(''),
  entity: z.string().catch(''),
});

export const IndividualsSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt']).catch('createdAt'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).catch([authenticatedUserId, null]),
        status: z.array(z.enum(CaseStatuses)).catch([CaseStatus.ACTIVE]),
        tasksStatus: z.array(
          z.enum(DocumentDecisionStatuses).catch(DocumentDecisionStatus.PENDING),
        ),
      })
      .catch({
        assigneeId: [authenticatedUserId, null],
        status: [CaseStatus.ACTIVE],
        tasksStatus: [DocumentDecisionStatus.PENDING],
      }),
  });
export const BusinessesSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['createdAt', 'companyName']).catch('createdAt'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).catch([authenticatedUserId, null]),
        status: z.array(z.enum(CaseStatuses)).catch([CaseStatus.ACTIVE]),
        tasksStatus: z.array(
          z.enum(DocumentDecisionStatuses).catch(DocumentDecisionStatus.PENDING),
        ),
      })
      .catch({
        assigneeId: [authenticatedUserId, null],
        status: [CaseStatus.ACTIVE],
        tasksStatus: [DocumentDecisionStatus.PENDING],
      }),
  });
