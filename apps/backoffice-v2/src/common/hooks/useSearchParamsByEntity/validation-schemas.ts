import { z } from 'zod';
import { CaseStatus, CaseStatuses } from '../../enums';

export const BaseSearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch('desc'),
  pageSize: z.coerce.number().int().positive().catch(50),
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().catch(''),
});

export const SearchSchema = BaseSearchSchema.extend({
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

export const MonitoringReportsTabs = [
  'websitesCompany',
  'websiteLineOfBusiness',
  'websiteCredibility',
  'ecosystemAndTransactions',
  'adsAndSocialMedia',
] as const;

export const CaseTabs = [
  'summary',
  'companyInformation',
  'storeInfo',
  'documents',
  'ubos',
  'associatedCompanies',
  'directors',
  'monitoringReports',
] as const;

export const IndividualsSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt']).catch('createdAt'),
    filter: createFilterSchema(authenticatedUserId),
    activeTab: z.enum(CaseTabs).catch(CaseTabs[0]).optional(),
    activeMonitoringTab: z.enum(MonitoringReportsTabs).catch(MonitoringReportsTabs[0]).optional(),
  });

export const BusinessesSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['createdAt', 'companyName']).catch('createdAt'),
    filter: createFilterSchema(authenticatedUserId),
    activeTab: z.enum(CaseTabs).catch(CaseTabs[0]).optional(),
    activeMonitoringTab: z.enum(MonitoringReportsTabs).catch(MonitoringReportsTabs[0]).optional(),
  });
