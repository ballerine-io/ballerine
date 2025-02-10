import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { ProfilesSearchSchema } from '@/pages/Profiles/profiles-search-schema';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useIndividualsProfilesQuery } from '@/domains/profiles/hooks/queries/useIndividualsProfilesQuery/useIndividualsProfilesQuery';

export const useIndividualsLogic = () => {
  const { search, onSearch } = useSearch();
  const [{ filter, page, pageSize, sortBy, sortDir }] = useZodSearchParams(ProfilesSearchSchema);
  const { data: individualsProfiles, isLoading: isLoadingIndividualsProfiles } =
    useIndividualsProfilesQuery({
      search,
      filter,
      page,
      pageSize,
      sortBy,
      sortDir,
    });
  const { onPaginate, onPrevPage, onNextPage, onLastPage } = usePagination({
    totalPages: 0,
  });
  const isLastPage =
    (individualsProfiles?.length ?? 0) < pageSize || individualsProfiles?.length === 0;

  return {
    isLoadingIndividualsProfiles,
    individualsProfiles,
    onPaginate,
    onPrevPage,
    onNextPage,
    onLastPage,
    isLastPage,
    page,
    search,
    onSearch,
  };
};
