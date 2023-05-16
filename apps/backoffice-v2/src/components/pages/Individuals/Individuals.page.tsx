import { SubjectsList } from 'components/organisms/SubjectsList/SubjectsList';
import { Outlet } from '@tanstack/react-router';

import { Pagination } from 'components/organisms/Pagination/Pagination';
import { useIndividuals } from 'components/pages/Individuals/hooks/useIndividuals/useIndividuals';
import { Subject } from 'components/organisms/Subject/Subject';
import { MotionScrollArea } from 'components/molecules/MotionScrollArea/MotionScrollArea';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';

export const Individuals = () => {
  const {
    onPaginate,
    onSearch,
    onFilter,
    onSortBy,
    onSortDir,
    search,
    subjects,
    isLoading,
    page,
    pages,
    totalPages,
    skeletons,
    routerId,
  } = useIndividuals();
  const entity = useFilterEntity();

  return (
    <>
      <SubjectsList
        onSearch={onSearch}
        onFilter={onFilter}
        onSortBy={onSortBy}
        onSortDir={onSortDir}
        search={search}
        routerId={routerId}
      >
        <MotionScrollArea className={`h-[calc(100vh-210px)]`}>
          <SubjectsList.List>
            {isLoading
              ? skeletons.map(index => (
                  <SubjectsList.SkeletonItem key={`subjects-list-skeleton-${index}`} />
                ))
              : subjects?.map(
                  ({
                    id,
                    firstName,
                    lastName,
                    createdAt,
                    companyName,
                    assigneeId,
                    assigneeFullName,
                    avatarUrl,
                    approvalState,
                  }) => (
                    <SubjectsList.Item
                      key={id}
                      id={id}
                      fullName={entity !== 'businesses' ? `${firstName} ${lastName}` : companyName}
                      avatarUrl={avatarUrl}
                      createdAt={createdAt}
                      assigneeId={assigneeId}
                      assigneeFullName={assigneeFullName}
                      status={approvalState}
                    />
                  ),
                )}
          </SubjectsList.List>
        </MotionScrollArea>
        <div className={`divider my-0 px-4`}></div>
        <Pagination onPaginate={onPaginate} page={page} pages={pages} totalPages={totalPages} />
      </SubjectsList>
      {/* Display skeleton individual when loading the end users list */}
      {isLoading && (
        <Subject>
          {/* Reject and approve header */}
          <Subject.Actions id={''} fullName={''} avatarUrl={''} />

          <Subject.Content>
            <div>
              <Subject.FaceMatch faceAUrl={''} faceBUrl={''} isLoading />
              <Subject.Info info={{}} isLoading whitelist={[]} />
            </div>
            <Subject.Documents documents={[]} isLoading />
          </Subject.Content>
        </Subject>
      )}
      {!subjects.length && !isLoading ? (
        <div className={`p-2`}>
          <h2 className={`mt-4 text-6xl`}>No users were found</h2>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};
