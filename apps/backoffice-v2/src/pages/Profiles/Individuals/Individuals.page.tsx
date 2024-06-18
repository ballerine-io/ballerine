import { isNonEmptyArray } from '@ballerine/common';
import { useIndividualsLogic } from '@/pages/Profiles/Individuals/hooks/useIndividualsLogic/useIndividualsLogic';
import { ProfilesTable } from '@/pages/Profiles/Individuals/components/ProfilesTable';
import { NoProfiles } from '@/pages/Profiles/Individuals/components/NoProfiles/NoProfiles';
import { ProfilesHeader } from './components/ProfilesHeader';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';

export const Individuals = () => {
  const {
    isLoadingIndividualsProfiles,
    individualsProfiles,
    page,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
    search,
    onSearch,
  } = useIndividualsLogic();

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Individuals Profiles</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <ProfilesHeader search={search} onSearch={onSearch} />
        {isNonEmptyArray(individualsProfiles) && <ProfilesTable data={individualsProfiles ?? []} />}
        {Array.isArray(individualsProfiles) &&
          !individualsProfiles.length &&
          !isLoadingIndividualsProfiles && <NoProfiles />}
        <div className={`mt-auto flex items-center gap-x-2`}>
          <UrlPagination
            page={page}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onPaginate={onPaginate}
            isLastPage={isLastPage}
          />
        </div>
      </div>
    </div>
  );
};
