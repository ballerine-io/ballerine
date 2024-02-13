import { Button } from '@/common/components/atoms/Button/Button';
import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import { AlertsFilters } from 'src/pages/TransactionMonitoringAlerts/components/AlertsFilters';
import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { TUsers } from '@/domains/users/types';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { useAssignAlertsByIdsMutation } from '@/domains/alerts/hooks/mutations/useAssignAlertsMutation/useAssignAlertsMutation';
import { AlertsAssignDropdown } from '@/pages/TransactionMonitoringAlerts/components/AlertsAssignDropdown/AlertsAssignDropdown';

export const AlertsHeader: FunctionComponent<{
  assignees: TUsers;
  authenticatedUser: TUsers[number];
  search: ComponentProps<typeof Search>['value'];
  onSearch: (search: string) => void;
}> = ({ assignees, authenticatedUser, search, onSearch }) => {
  const { selected, onClearSelect } = useSelect();
  const isNoAlertsSelected = Object.keys(selected ?? {}).length === 0;
  const { mutate: mutateAssignAlerts } = useAssignAlertsByIdsMutation({
    onSuccess: onClearSelect,
  });
  const onMutateAssignAlerts = useCallback(
    (assigneeId: string | null, isAssignedToMe: boolean) => () => {
      mutateAssignAlerts({
        assigneeId,
        alertIds: Object.keys(selected ?? {}),
        isAssignedToMe,
      });
    },
    [mutateAssignAlerts, selected],
  );

  return (
    <div className="flex items-end justify-between pb-2">
      <div className="flex gap-6">
        {/*  Uncomment when search is implemented server-side */}
        {/*<Search value={search} onChange={onSearch} />*/}
        <AlertsFilters assignees={assignees} authenticatedUserId={authenticatedUser?.id} />
      </div>
      <div className="flex gap-4">
        <AlertsAssignDropdown
          assignees={assignees ?? []}
          authenticatedUserId={authenticatedUser?.id}
          onAssigneeSelect={onMutateAssignAlerts}
          isDisabled={isNoAlertsSelected}
        />
        <Button variant="outline" size={'wide'}>
          Decision
        </Button>
      </div>
    </div>
  );
};
