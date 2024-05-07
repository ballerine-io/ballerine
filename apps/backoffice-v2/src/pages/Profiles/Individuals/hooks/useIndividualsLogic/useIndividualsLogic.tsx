import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { ProfilesSearchSchema } from '@/pages/Profiles/profiles-search-schema';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useIndividualsProfilesQuery } from '@/domains/profiles/hook/queries/useIndividualsProfilesQuery/useIndividualsProfilesQuery';

export const useIndividualsLogic = () => {
  const [{ search: searchValue, filter, page, pageSize, sortBy, sortDir }] =
    useZodSearchParams(ProfilesSearchSchema);
  const { onPaginate, onPrevPage, onNextPage } = usePagination();
  const { data: individualsProfiles, isLoading: isLoadingIndividualsProfiles } =
    useIndividualsProfilesQuery({
      search: searchValue,
      filter,
      page,
      pageSize,
      sortBy,
      sortDir,
    });
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
