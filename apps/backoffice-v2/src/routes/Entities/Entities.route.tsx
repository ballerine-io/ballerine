import { caseManagementRoute } from '../CaseManagement/CaseManagement.route';
import { queryClient } from '../../lib/react-query/query-client';
import { z } from 'zod';
import { Route } from '@tanstack/react-router';
import {queryKeys} from "../../domains/entities/query-keys";
import {usersQueryKeys} from "../../domains/users/query-keys";
import {Entities} from "./Entities.page";
import {auth} from "../../domains/auth/mock-service-worker/auth/auth.data";
import {CaseStatuses, States} from "../../common/enums";
import {TAuthenticatedUser} from "../../domains/auth/types";
import {preSearchFiltersByKind} from "./pre-search-filters";

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
  return {
    ...(await preSearchFiltersByKind[search?.entity](user)),
    ...search,
  };
}

export const entitiesRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  validateSearch: search =>
    getSearchEntitySchema(search),
  preSearchFilters: [
    search => ( async () => {
      console.log("filers setup")
      const signedUser = auth.getSession();
      const authenticatedUser = await queryClient.ensureQueryData(signedUser.queryKey, signedUser.queryFn) as TAuthenticatedUser;

      return await generateDefaultSearchFilters(search, authenticatedUser)
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
