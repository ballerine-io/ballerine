import { caseManagementRoute } from 'components/pages/CaseManagement/CaseManagement.route';
import { queryClient } from '../../../lib/react-query/query-client';
import { z } from 'zod';
import { Route } from '@tanstack/react-router';
import { Individuals } from 'components/pages/Individuals/Individuals.page';
import { States } from '../../../enums';
import { queries } from '../../../lib/react-query/queries';
import { preSearchFiltersByKind } from 'components/pages/Individuals/pre-search-filters';
import { users } from '../../../lib/react-query/users';

const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).optional().catch('desc'),
  pageSize: z.number().int().optional().catch(10),
  page: z.number().int().optional().catch(1),
  search: z.string().optional().catch(''),
  filterId: z.string().catch(''),
});

const IndividualsSearchSchema = SearchSchema.extend({
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'phone', 'caseCreatedAt', 'approvalState'])
    .optional()
    .catch('caseCreatedAt'),
  filter: z
    .object({
      approvalState: z.array(z.enum(States)).optional().catch([]),
      assigneeId: z.array(z.string().nullable()).optional().catch([]),
    })
    .optional(),
  entity: z.literal('individuals').catch('individuals'),
});

const BusinessesSearchSchema = SearchSchema.extend({
  sortBy: z.enum(['caseCreatedAt', 'companyName']).optional().catch('caseCreatedAt'),
  filter: z
    .object({
      assigneeId: z.array(z.string().nullable()).optional().catch([]),
      caseStatus: z
        .array(z.enum(['active']))
        .optional()
        .catch([]),
      // businessType: z.array(z.string()).optional().catch([]),
    })
    .optional(),
  entity: z.literal('businesses').catch('businesses'),
});

export const individualsRoute = new Route({
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
    const entityList = queries[search?.entity].list(search?.filterId);
    const usersList = users.list();
    await queryClient.ensureQueryData(entityList.queryKey, entityList.queryFn);
    await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);

    return {};
  },
  path: 'individuals',
  component: Individuals,
});
