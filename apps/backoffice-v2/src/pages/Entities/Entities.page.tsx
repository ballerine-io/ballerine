import { Cases } from './components/Cases/Cases';
import { Outlet } from 'react-router-dom';
import { Pagination } from '../../common/components/organisms/Pagination/Pagination';
import { useEntities } from './hooks/useEntities/useEntities';
import { Case } from '../Entity/components/Case/Case';
import { MotionScrollArea } from '../../common/components/molecules/MotionScrollArea/MotionScrollArea';
import { FunctionComponent } from 'react';

export const Entities: FunctionComponent = () => {
  const {
    onPaginate,
    onSearch,
    onFilter,
    onSortBy,
    onSortDirToggle,
    search,
    cases,
    isLoading,
    page,
    totalPages,
    skeletonEntities,
    entity,
  } = useEntities();

  return (
    <>
      <Cases
        onSearch={onSearch}
        onFilter={onFilter}
        onSortBy={onSortBy}
        onSortDirToggle={onSortDirToggle}
        search={search}
      >
        <MotionScrollArea className={`h-[calc(100vh-210px)]`}>
          <Cases.List>
            {isLoading
              ? skeletonEntities.map(index => (
                  <Cases.SkeletonItem key={`cases-list-skeleton-${index}`} />
                ))
              : cases?.map(case_ => (
                  <Cases.Item
                    key={case_.id}
                    id={case_.id}
                    fullName={case_.entity.name}
                    avatarUrl={case_.entity.avatarUrl}
                    createdAt={case_.createdAt}
                    assigneeId={case_.assignee?.id}
                    assigneeFullName={`${case_.assignee?.firstName} ${case_.assignee?.lastName}`}
                    status={case_.entity.approvalState}
                  />
                ))}
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
      {Array.isArray(cases) && !cases.length && !isLoading ? (
        <div className={`p-2`}>
          <h2 className={`mt-4 text-6xl`}>No cases were found</h2>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};
