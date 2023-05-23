import { caseManagementRoute } from '../CaseManagement/CaseManagement.route';
import { queryClient } from '../../lib/react-query/query-client';
import { z } from 'zod';
import { Route } from '@tanstack/react-router';
import { Entities } from './Entities.page';
import { States } from '../../enums';
import { queryKeys } from '../../lib/react-query/query-keys';
import { preSearchFiltersByKind } from './pre-search-filters';
import { usersQueryKeys } from '../../users/query-keys';

const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).optional().catch('desc'),
  pageSize: z.number().int().optional().catch(10),
  page: z.number().int().optional().catch(1),
  search: z.string().optional().catch(''),
  filterId: z.string().catch(''),
});

const IndividualsSearchSchema = SearchSchema.extend({
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'phone', 'createdAt', 'approvalState'])
    .optional()
    .catch('createdAt'),
  filter: z
    .object({
      approvalState: z.array(z.enum(States)).optional().catch([]),
      endUserType: z.array(z.string()).optional().catch([]),
      assigneeId: z.array(z.string().nullable()).optional().catch([]),
    })
    .optional(),
  entity: z.literal('individuals').catch('individuals'),
});

const BusinessesSearchSchema = SearchSchema.extend({
  sortBy: z.enum(['createdAt', 'companyName']).optional().catch('createdAt'),
  filter: z
    .object({
      approvalState: z.array(z.enum(States)).optional().catch([]),
      assigneeId: z.array(z.string().nullable()).optional().catch([]),
      // businessType: z.array(z.string()).optional().catch([]),
    })
    .optional(),
  entity: z.literal('businesses').catch('businesses'),
});

export const entitiesRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  validateSearch: search =>
    search?.entity === 'businesses'
      ? BusinessesSearchSchema.parse(search)
      : IndividualsSearchSchema.parse(search),
  preSearchFilters: [
    search => ({
      ...preSearchFiltersByKind[search?.entity],
      ...search,
    }),
  ],
  onLoad: async ({ search }) => {
    const entityList = queryKeys[search?.entity].list(search?.filterId);
    const usersList = usersQueryKeys.list();
    await queryClient.ensureQueryData(entityList.queryKey, entityList.queryFn);
    await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);

    return {};
  },
  path: 'entities',
  component: Entities,
});
