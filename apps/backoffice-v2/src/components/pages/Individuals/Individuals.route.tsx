import { caseManagementRoute } from 'components/pages/CaseManagement/CaseManagement.route';
import { queryClient } from '../../../lib/react-query/query-client';
import { z } from 'zod';
import { Route } from '@tanstack/react-router';
import { Individuals } from 'components/pages/Individuals/Individuals.page';
import { States } from '../../../enums';
import { queries } from '../../../lib/react-query/queries';
import { preSearchFiltersByKind } from 'components/pages/Individuals/pre-search-filters';

const SearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).optional().catch('desc'),
  pageSize: z.number().int().optional().catch(10),
  page: z.number().int().optional().catch(1),
  search: z.string().optional().catch(''),
  filterId: z.string().catch(''),
});

const IndividualsSearchSchema = SearchSchema.extend({
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'phone', 'createdAt', 'state'])
    .optional()
    .catch('createdAt'),
  filter: z
    .object({
      state: z.array(z.enum(States)).optional().catch([]),
      endUserType: z.array(z.string()).optional().catch([]),
    })
    .optional(),
  kind: z.literal('individuals').catch('individuals'),
});

const CompaniesSearchSchema = SearchSchema.extend({
  sortBy: z.enum(['website', 'address']).optional().catch('website'),
  filter: z
    .object({
      state: z
        .array(z.enum([States]))
        .optional()
        .catch([]),
      companyType: z.array(z.string()).optional().catch([]),
    })
    .optional(),
  kind: z.literal('companies').catch('companies'),
});

export const individualsRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  validateSearch: search =>
    search?.kind === 'companies'
      ? CompaniesSearchSchema.parse(search)
      : IndividualsSearchSchema.parse(search),
  preSearchFilters: [
    search => ({
      ...preSearchFiltersByKind[search?.kind],
      ...search,
    }),
  ],
  onLoad: async ({ search }) => {
    const entityList = queries[search?.kind].list(search?.filterId);
    await queryClient.ensureQueryData(entityList.queryKey, entityList.queryFn);

    return {};
  },
  path: 'individuals',
  component: Individuals,
});
