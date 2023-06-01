import { caseManagementRoute } from '../CaseManagement/CaseManagement.route';
import { queryClient } from '../../lib/react-query/query-client';
import { z } from 'zod';
import { Route } from '@tanstack/react-router';
import { queryKeys } from '../../domains/entities/query-keys';
import { usersQueryKeys } from '../../domains/users/query-keys';
import { Entities } from './Entities.page';
import { CaseStatuses, States } from '../../common/enums';
import { TAuthenticatedUser } from '../../domains/auth/types';
import { generatePreSearchFiltersByEntity } from './pre-search-filters';
import { authQueryKeys } from '../../domains/auth/query-keys';
import { router } from '../../App/App.Router';

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
      caseStatus: z.array(z.enum(CaseStatuses)).optional().catch([]),
    })
    .optional(),
  entity: z.literal('individuals').catch('individuals'),
});

const BusinessesSearchSchema = SearchSchema.extend({
  sortBy: z.enum(['caseCreatedAt', 'companyName']).optional().catch('caseCreatedAt'),
  filter: z
    .object({
      assigneeId: z.array(z.string().nullable()).optional().catch([]),
      caseStatus: z.array(z.enum(CaseStatuses)).optional().catch([]),
      // businessType: z.array(z.string()).optional().catch([]),
    })
    .optional(),
  entity: z.literal('businesses').catch('businesses'),
});

function getSearchEntitySchema(search) {
  return search?.entity === 'businesses'
    ? BusinessesSearchSchema.parse(search)
    : IndividualsSearchSchema.parse(search);
}

async function generateDefaultSearchFilters(search, user: TAuthenticatedUser) {
  const presearchFilter = await generatePreSearchFiltersByEntity(search?.entity, user);

  return {
    ...presearchFilter,
    ...search,
  };
}

const isDefaultFiltersAlreadySet = (search: any) => {
  return !!search?.[search.entity]?.filter?.assigneeId;
};

const navigateDefaultFilterParams = async (search, authenticatedUser, defaultFilters) => {
  router.navigate({
    search: {
      ...defaultFilters,
    },
  });
};

export const entitiesRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  validateSearch: search => getSearchEntitySchema(search),
  onLoad: async ({ search }) => {
    const entityList = queryKeys[search?.entity].list(search?.filterId);
    const usersList = usersQueryKeys.list();
    await queryClient.ensureQueryData(entityList.queryKey, entityList.queryFn);
    await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);

    if (!isDefaultFiltersAlreadySet(search)) {
      const authenticatedUserKeys = authQueryKeys.authenticatedUser();
      const { user: authenticatedUser } = await queryClient.ensureQueryData(
        authenticatedUserKeys.queryKey,
        authenticatedUserKeys.queryFn,
      );
      const defaultFiltersSearchParams = await generateDefaultSearchFilters(search, authenticatedUser);

      await navigateDefaultFilterParams(search, authenticatedUser, defaultFiltersSearchParams);
    }

    return {};
  },
  path: 'entities',
  component: Entities,
});
