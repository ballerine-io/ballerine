import { fetchCompanyInformation } from '@app/domains/companies/companies.api';
import { GetCompanyInformationDto } from '@app/domains/companies/types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const companiesQueryKeys = createQueryKeys('companies', {
  fetchCompanyInformation: (query: GetCompanyInformationDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchCompanyInformation(query),
  }),
});
