import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { ProfilesSearchSchema } from '@/pages/Profiles/profiles-search-schema';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { TObjectValues } from '@/common/types';
import { KYC, Role, Sanction } from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';

export const useIndividualsLogic = () => {
  const isLoadingIndividualsProfiles = false;
  const individualsProfiles = [
    {
      id: '1',
      createdAt: '2021-10-01',
      name: 'John Doe',
      business: 'ACME Inc.',
      role: 'UBO',
      kyc: 'completed',
      sanctions: 'monitored',
      updatedAt: '2021-10-01',
    },
    {
      id: '2',
      createdAt: '2021-10-02',
      name: 'Jane Doe',
      business: 'ACME Inc.',
      role: 'director',
      kyc: 'pending',
      sanctions: 'not monitored',
      updatedAt: '2021-10-02',
    },
    {
      id: '3',
      createdAt: '2021-10-03',
      name: 'John Smith',
      business: 'ACME Inc.',
      role: 'authorized signatory',
      kyc: 'approved',
      sanctions: 'monitored',
      updatedAt: '2021-10-03',
    },
    {
      id: '4',
      createdAt: '2021-10-03',
      name: 'Bob Smith',
      business: 'ACME Inc.',
      role: 'authorized signatory',
      kyc: 'declined',
      sanctions: 'not monitored',
      updatedAt: '2021-10-03',
    },
    {
      id: '5',
      createdAt: '2021-10-03',
      name: 'Alice Smith',
      business: 'ACME Inc.',
      role: 'authorized signatory',
      kyc: 'revisions',
      sanctions: 'monitored',
      updatedAt: '2021-10-03',
    },
  ] satisfies Array<{
    id: string;
    createdAt: string;
    name: string;
    business: string;
    role: TObjectValues<typeof Role>;
    kyc: TObjectValues<typeof KYC>;
    sanctions: TObjectValues<typeof Sanction>;
    alerts: number;
    updatedAt: string;
  }>;
  const [{ page, pageSize, search: searchValue }] = useZodSearchParams(ProfilesSearchSchema);
  const { onPaginate, onPrevPage, onNextPage } = usePagination();
  const isLastPage =
    (individualsProfiles?.length ?? 0) < pageSize || individualsProfiles?.length === 0;
  const { search, onSearch } = useSearch({
    initialSearch: searchValue,
  });

  return {
    isLoadingIndividualsProfiles,
    individualsProfiles,
    onPaginate,
    onPrevPage,
    onNextPage,
    isLastPage,
    page,
    search,
    onSearch,
  };
};
