import { z } from 'zod';
import { CaseStatus, CaseStatuses } from '../../enums';
import { ParsedBooleanSchema } from '@ballerine/ui';

export const BaseSearchSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch('desc'),
  pageSize: z.coerce.number().int().positive().catch(50),
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().catch(''),
  isNotesOpen: ParsedBooleanSchema.catch(false),
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
  'ecosystem',
  'adsAndSocialMedia',
  'transactions',
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
  'customData',
] as const;

export const TabToLabel = {
  summary: 'Summary',
  companyInformation: 'Company',
  storeInformation: 'Store',
  documents: 'Documents',
  ubos: 'UBOs',
  associatedCompanies: 'Associated Companies',
  directors: 'Directors',
  monitoringReports: 'Monitoring Reports',
  customData: 'Custom Data',
} as const;

export const CaseTabsSchema = z.enum(CaseTabs);

export const IndividualsSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt']).catch('createdAt'),
    filter: createFilterSchema(authenticatedUserId),
    activeTab: CaseTabsSchema.catch(CaseTabs[0]),
    activeMonitoringTab: z.enum(MonitoringReportsTabs).catch(MonitoringReportsTabs[0]),
  });

export const BusinessesSearchSchema = (authenticatedUserId: string) =>
  SearchSchema.extend({
    sortBy: z.enum(['createdAt', 'companyName']).catch('createdAt'),
    filter: createFilterSchema(authenticatedUserId),
    activeTab: z.enum(CaseTabs).catch(CaseTabs[0]),
    activeMonitoringTab: z.enum(MonitoringReportsTabs).catch(MonitoringReportsTabs[0]),
  });
