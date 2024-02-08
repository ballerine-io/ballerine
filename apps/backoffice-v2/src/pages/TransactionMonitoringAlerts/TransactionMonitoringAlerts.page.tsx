import { Pagination } from '@/common/components/molecules/Pagination/Pagination';
import { PaginationContent } from '@/common/components/molecules/Pagination/Pagination.Content';
import { PaginationEllipsis } from '@/common/components/molecules/Pagination/Pagination.Ellipsis';
import { PaginationFirst } from '@/common/components/molecules/Pagination/Pagination.First';
import { PaginationItem } from '@/common/components/molecules/Pagination/Pagination.Item';
import { PaginationLast } from '@/common/components/molecules/Pagination/Pagination.Last';
import { PaginationLink } from '@/common/components/molecules/Pagination/Pagination.Link';
import { PaginationNext } from '@/common/components/molecules/Pagination/Pagination.Next';
import { PaginationPrevious } from '@/common/components/molecules/Pagination/Pagination.Previous';
import { useAlertsQuery } from '@/domains/alerts/hooks/queries/useAlertsQuery/useAlertsQuery';
import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet';
import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { Header } from 'src/pages/TransactionMonitoringAlerts/components/Header';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { z } from 'zod';
import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { AlertStatus, AlertStatuses, TAlertsList } from '@/domains/alerts/fetchers';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useMemo } from 'react';

export const getAlertsSearchSchema = (authenticatedUserId: string | null) =>
  BaseSearchSchema.extend({
    sortBy: z
      .enum(['dataTimestamp', 'status'] as const satisfies Pick<
        ReadonlyArray<keyof TAlertsList[number]>,
        'dataTimestamp' | 'status'
      >)
      .catch('dataTimestamp'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).catch([authenticatedUserId, null]),
        status: z.array(z.enum(AlertStatuses)).catch([AlertStatus.NEW]),
        state: z.array(z.string().nullable()).catch([]),
      })
      .catch({
        // assigneeId: [authenticatedUserId, null],
        // status: [AlertStatus.NEW],
        // state: [],
      }),
  });

export const useTransactionMonitoringAlertsLogic = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const AlertsSearchSchema = getAlertsSearchSchema(session?.user?.id);
  const [{ filter, sortBy, sortDir, page, pageSize, search }, setSearchParams] =
    useZodSearchParams(AlertsSearchSchema);
  const { data: alerts } = useAlertsQuery({
    filter,
    page,
    pageSize,
    search,
    sortDir,
    sortBy,
  });
  const { data: assignees } = useUsersQuery();
  const sortedAssignees = useMemo(
    () =>
      // Sort assignees so that the authenticated user is always first
      assignees
        ?.slice()
        ?.sort((a, b) => (a?.id === session?.user?.id ? -1 : b?.id === session?.user?.id ? 1 : 0)),
    [assignees, session?.user?.id],
  );
  const [isSheetOpen, toggleIsAlertAnalysisSheetOpen, toggleOnIsAlertAnalysisSheetOpen] =
    useToggle();

  return {
    alerts,
    isSheetOpen,
    toggleOnIsAlertAnalysisSheetOpen,
    toggleIsAlertAnalysisSheetOpen,
    assignees: sortedAssignees,
    authenticatedUserId: session?.user?.id,
  };
};

export const TransactionMonitoringAlerts = () => {
  const {
    alerts,
    isSheetOpen,
    toggleOnIsAlertAnalysisSheetOpen,
    toggleIsAlertAnalysisSheetOpen,
    assignees,
    authenticatedUserId,
  } = useTransactionMonitoringAlertsLogic();

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Transaction Monitoring Alerts</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <Header assignees={assignees ?? []} authenticatedUserId={authenticatedUserId} />
        <AlertsTable
          data={alerts ?? []}
          toggleOnIsAlertAnalysisSheetOpen={toggleOnIsAlertAnalysisSheetOpen}
        />
        <div className={`flex items-center gap-x-2`}>
          <span className={`min-w-fit text-sm font-semibold`}>
            Page {1} of {10}
          </span>
          <Pagination className={`justify-start`}>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst to="#" iconOnly />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious to="#" iconOnly />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext to="#" iconOnly />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast to="#" iconOnly />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <AlertAnalysisSheet isOpen={isSheetOpen} onOpenStateChange={toggleIsAlertAnalysisSheetOpen} />
    </div>
  );
};
