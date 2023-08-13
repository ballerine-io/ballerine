import { Cases } from './components/Cases/Cases';
import { Outlet } from 'react-router-dom';
import { Pagination } from '../../common/components/organisms/Pagination/Pagination';
import { useEntities } from './hooks/useEntities/useEntities';
import { Case } from '../Entity/components/Case/Case';
import { MotionScrollArea } from '../../common/components/molecules/MotionScrollArea/MotionScrollArea';
import { FunctionComponent } from 'react';
import { NoCasesSvg } from '../../common/components/atoms/icons';

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
        <div className="flex items-center justify-center border-l-[1px] p-4">
          <div className="inline-flex flex-col  items-start gap-4 rounded-md border-[1px] border-[#CBD5E1] p-6">
            <div className="flex w-[464px] items-center justify-center">
              <NoCasesSvg width={96} height={81} />
            </div>

            <div className="flex w-[464px] flex-col items-start gap-2">
              <h2 className="text-lg font-[600]">No cases found</h2>

              <div className="text-sm leading-[20px]">
                <p className="font-[400]">
                  It looks like there aren&apos;t any cases in your queue right now.
                </p>

                <div className="mt-[20px] flex flex-col">
                  <span className="font-[700]">What can you do now?</span>

                  <ul className="list-disc pl-6 pr-2">
                    <li>Make sure to refresh or check back often for new cases.</li>
                    <li>Ensure that your filters aren&apos;t too narrow.</li>
                    <li>
                      If you suspect a technical issue, reach out to your technical team to diagnose
                      the issue.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};
