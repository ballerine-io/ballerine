import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import { AlertsFilters } from 'src/pages/TransactionMonitoringAlerts/components/AlertsFilters';
import React, { ComponentProps, FunctionComponent, ReactNode, useCallback } from 'react';
import { TUsers } from '@/domains/users/types';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { useAssignAlertsByIdsMutation } from '@/domains/alerts/hooks/mutations/useAssignAlertsMutation/useAssignAlertsMutation';
import { AlertsAssignDropdown } from '@/pages/TransactionMonitoringAlerts/components/AlertsAssignDropdown/AlertsAssignDropdown';
import { Dropdown } from '@/common/components/molecules/Dropdown/Dropdown';
import { DoubleCaretSvg } from '@/common/components/atoms/icons';
import { AlertStates, alertStateToDecision } from '@/domains/alerts/fetchers';
import { lowerCase, snakeCase, toUpperCase } from 'string-ts';

export const AlertsDecisionDropdown: FunctionComponent<{
  decisions: Array<{
    id: string;
    value: ReactNode;
  }>;
  isDisabled: boolean;
  onDecisionSelect: (decision: string) => () => void;
}> = ({ decisions, isDisabled, onDecisionSelect }) => {
  return (
    <Dropdown
      options={decisions}
      trigger={
        <>
          Decision
          <DoubleCaretSvg />
        </>
      }
      props={{
        trigger: {
          disabled: isDisabled,
          className:
            'flex min-w-[11.3ch] items-center justify-between gap-x-4 rounded-lg border border-neutral/10 px-4 py-1.5 text-sm disabled:opacity-50 dark:border-neutral/60',
        },
        content: {
          className: 'min-w-[14rem]',
          align: 'end',
        },
      }}
    >
      {({ item, DropdownItem }) => (
        <DropdownItem
          key={item?.id}
          className={'flex items-center gap-x-2'}
          onClick={onDecisionSelect(item?.value)}
        >
          {item?.value}
        </DropdownItem>
      )}
    </Dropdown>
  );
};

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
  const comingSoonDecisions = [
    'Escalate',
    'Ask user for information',
    'Block or Hold',
    'Report to Authorities',
  ] as const;
  const decisions = [
    ...['Revert Decision', ...AlertStates]
      .map(state => {
        const screamingSnakeState = toUpperCase(snakeCase(state));

        return alertStateToDecision[screamingSnakeState as keyof typeof alertStateToDecision];
      })
      .filter(Boolean)
      .map(decision => ({
        id: decision,
        value: (
          <>
            {lowerCase(decision) === 'reject' && (
              <span className={`text-destructive`}>{decision}</span>
            )}

            {lowerCase(decision) === 'not suspicious' && (
              <span className={`text-success`}>{decision}</span>
            )}

            {lowerCase(decision) !== 'reject' &&
              lowerCase(decision) !== 'not suspicious' &&
              decision}
          </>
        ),
      })),
    ...comingSoonDecisions.map(decision => ({
      id: decision,
      value: (
        <div className={'flex items-center gap-x-2 text-slate-300/90'}>
          {decision} <span className={'text-xs'}>(soon)</span>
        </div>
      ),
    })),
  ];

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
        <AlertsDecisionDropdown
          decisions={decisions}
          isDisabled={isNoAlertsSelected}
          onDecisionSelect={() => () => {}}
        />
      </div>
    </div>
  );
};
