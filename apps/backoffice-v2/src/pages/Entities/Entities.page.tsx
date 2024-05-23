import { CaseCreation } from '@/pages/Entities/components/CaseCreation';
import { ctw } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';
import { TAssignee } from '../../common/components/atoms/AssignDropdown/AssignDropdown';
import { MotionScrollArea } from '../../common/components/molecules/MotionScrollArea/MotionScrollArea';
import { Pagination } from '../../common/components/organisms/Pagination/Pagination';
import { Case } from '../Entity/components/Case/Case';
import { Cases } from './components/Cases/Cases';
import { useEntities } from './hooks/useEntities/useEntities';
import { NoCases } from '@/pages/Entities/components/NoCases/NoCases';
import { OngoingMonitoringRiskSheet } from '@/pages/BusinessesAlertsAnalysis/components/OngoingMonitoringRiskSheet';

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
    caseCount,
    skeletonEntities,
    isManualCaseCreationEnabled,
  } = useEntities();

  return (
    <OngoingMonitoringRiskSheet
      businessReports={[
        {
          createdAt: '2021-10-01T00:00:00.000Z',
          report: {
            reportFileId: '1',
            reportId: '1',
          },
          riskScore: 1,
        },
        {
          createdAt: '2021-10-02T00:00:00.000Z',
          report: {
            reportFileId: '2',
            reportId: '2',
          },
          riskScore: 2,
        },
        {
          createdAt: '2021-10-03T00:00:00.000Z',
          report: {
            reportFileId: '3',
            reportId: '3',
          },
          riskScore: 3,
        },
        {
          createdAt: '2021-10-04T00:00:00.000Z',
          report: {
            reportFileId: '4',
            reportId: '4',
          },
          riskScore: 4,
        },
        {
          createdAt: '2021-10-05T00:00:00.000Z',
          report: {
            reportFileId: '5',
            reportId: '5',
          },
          riskScore: 5,
        },
      ]}
      onOpenStateChange={() => {}}
    />
  );

  return (
    <>
      <Cases
        onSearch={onSearch}
        onFilter={onFilter}
        onSortBy={onSortBy}
        onSortDirToggle={onSortDirToggle}
        search={search}
        count={caseCount}
      >
        <MotionScrollArea
          className={ctw({
            'h-[calc(100vh-300px)]': isManualCaseCreationEnabled,
            'h-[calc(100vh-240px)]': !isManualCaseCreationEnabled,
          })}
        >
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
                    createdAt={case_.createdAt}
                    assignee={
                      case_.assignee
                        ? ({
                            id: case_.assignee?.id,
                            fullName: `${case_.assignee?.firstName} ${case_.assignee?.lastName}`,
                            avatarUrl: case_.assignee?.avatarUrl,
                          } as TAssignee)
                        : null
                    }
                    tags={case_.tags}
                    entityAvatarUrl={case_.entity?.avatarUrl}
                  />
                ))}
          </Cases.List>
        </MotionScrollArea>
        <div className={`divider my-0 px-4`}></div>
        <div className="flex flex-col gap-5 px-4">
          <Pagination onPaginate={onPaginate} page={page} totalPages={totalPages} />
          {isManualCaseCreationEnabled && <CaseCreation />}
        </div>
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
      {Array.isArray(cases) && !cases.length && !isLoading ? <NoCases /> : <Outlet />}
    </>
  );
};
