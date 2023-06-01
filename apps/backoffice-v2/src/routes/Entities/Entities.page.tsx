import { Cases } from './components/Cases/Cases';
import { Outlet } from '@tanstack/react-router';
import { Pagination } from '../../common/components/organisms/Pagination/Pagination';
import { useEntities } from './hooks/useEntities/useEntities';
import { Case } from '../Entity/components/Case/Case';
import { MotionScrollArea } from '../../common/components/molecules/MotionScrollArea/MotionScrollArea';
import { useFilterEntity } from '../../domains/entities/hooks/useFilterEntity/useFilterEntity';
import { FunctionComponent } from 'react';

export const Entities: FunctionComponent = () => {
  const {
    onPaginate,
    onSearch,
    onFilter,
    onSortBy,
    onSortDir,
    search,
    cases,
    isLoading,
    page,
    totalPages,
    skeletonEntities,
    routerId,
  } = useEntities();
  const entity = useFilterEntity();

  return (
    <>
      <Cases
        onSearch={onSearch}
        onFilter={onFilter}
        onSortBy={onSortBy}
        onSortDir={onSortDir}
        search={search}
        routerId={routerId}
      >
        <MotionScrollArea className={`h-[calc(100vh-210px)]`}>
          <Cases.List>
            {isLoading
              ? skeletonEntities.map(index => (
                  <Cases.SkeletonItem key={`cases-list-skeleton-${index}`} />
                ))
              : cases?.map(
                  ({
                    id,
                    firstName,
                    lastName,
                    caseCreatedAt,
                    companyName,
                    assigneeId,
                    assigneeFullName,
                    avatarUrl,
                    approvalState,
                  }) => (
                    <Cases.Item
                      key={id}
                      id={id}
                      fullName={entity !== 'businesses' ? `${firstName} ${lastName}` : companyName}
                      avatarUrl={avatarUrl}
                      createdAt={caseCreatedAt}
                      assigneeId={assigneeId}
                      assigneeFullName={assigneeFullName}
                      status={approvalState}
                    />
                  ),
                )}
          </Cases.List>
        </MotionScrollArea>
        <div className={`divider my-0 px-4`}></div>
        <Pagination onPaginate={onPaginate} page={page} totalPages={totalPages} />
      </Cases>
      {/* Display skeleton individual when loading the entities list */}
      {isLoading && (
        <Case>
          {/* Reject and approve header */}
          <Case.Actions id={''} fullName={''} avatarUrl={''} />

          <Case.Content>
            <div>
              <Case.FaceMatch faceAUrl={''} faceBUrl={''} isLoading />
              <Case.Info info={{}} isLoading whitelist={[]} />
            </div>
            <Case.Documents documents={[]} isLoading />
          </Case.Content>
        </Case>
      )}
      {!cases.length && !isLoading ? (
        <div className={`p-2`}>
          <h2 className={`mt-4 text-6xl`}>No cases were found</h2>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};
