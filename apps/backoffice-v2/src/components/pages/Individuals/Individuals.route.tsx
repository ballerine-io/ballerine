import { caseManagementRoute } from 'components/pages/CaseManagement/CaseManagement.route';
import { endUsers } from '@/lib/react-query/end-users';
import { queryClient } from '@/lib/react-query/query-client';
import { z } from 'zod';
import { Route } from '@tanstack/react-router';
import { Individuals } from 'components/pages/Individuals/Individuals.page';
import { States } from '@/enums';

export const individualsRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  validateSearch: z.object({
    sortBy: z
      .enum(['firstName', 'lastName', 'email', 'phone', 'createdAt', 'state'])
      .optional()
      .catch('createdAt'),
    sortDir: z.enum(['asc', 'desc']).optional().catch('desc'),
    pageSize: z.number().int().optional().catch(10),
    page: z.number().int().optional().catch(1),
    filter: z
      .object({
        state: z.array(z.enum(States)).optional().catch([]),
        endUserType: z.array(z.string()).optional().catch([]),
      })
      .optional(),
    search: z.string().optional().catch(''),
  }).parse,
  preSearchFilters: [
    search => ({
      sortBy: 'createdAt' as const,
      sortDir: 'desc' as const,
      pageSize: 10,
      page: 1,
      filter: {
        state: [],
        endUserType: [],
      },
      search: '',
      ...search,
    }),
  ],
  onLoad: async () => {
    const endUsersList = endUsers.list();
    const data = queryClient.getQueryData(endUsersList.queryKey);

    if (data) return {};

    await queryClient.prefetchQuery(endUsersList.queryKey, endUsersList.queryFn);

    return {};
  },
  path: 'individuals',
  component: Individuals,
});
