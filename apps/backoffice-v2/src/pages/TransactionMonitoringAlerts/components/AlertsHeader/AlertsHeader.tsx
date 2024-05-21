import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { TObjectValues } from '@/common/types';
import { toScreamingSnakeCase } from '@/common/utils/to-screaming-snake-case/to-screaming-snake-case';
import { AlertStates, alertDecisionToState, alertStateToDecision } from '@/domains/alerts/fetchers';
import { useAlertsDecisionByIdsMutation } from '@/domains/alerts/hooks/mutations/useAlertsDecisionByIdsMutation/useAlertsDecisionByIdsMutation';
import { useAssignAlertsByIdsMutation } from '@/domains/alerts/hooks/mutations/useAssignAlertsMutation/useAssignAlertsMutation';
import { TUsers } from '@/domains/users/types';
import { AlertsAssignDropdown } from '@/pages/TransactionMonitoringAlerts/components/AlertsAssignDropdown/AlertsAssignDropdown';
import { AlertsDecisionDropdown } from '@/pages/TransactionMonitoringAlerts/components/AlertsDecisionDropdown/AlertsDecisionDropdown';
import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import { COMING_SOON_ALERT_DECISIONS } from '@/pages/TransactionMonitoringAlerts/constants';
import { ComponentProps, FunctionComponent, useCallback } from 'react';
import { AlertsFilters } from 'src/pages/TransactionMonitoringAlerts/components/AlertsFilters';
import { capitalize, lowerCase } from 'string-ts';

export const decisionToClassName = {
  [lowerCase(alertStateToDecision.REJECTED)]: 'text-destructive',
  [lowerCase(alertStateToDecision.CLEARED)]: 'text-success',
} as const satisfies Record<
  Extract<Lowercase<TObjectValues<typeof alertStateToDecision>>, 'reject' | 'clear'>,
  ComponentProps<'span'>['className']
>;

export const AlertsHeader: FunctionComponent<{
  assignees: TUsers;
  correlationIds: string[];
  authenticatedUser: TUsers[number];
  search: ComponentProps<typeof Search>['value'];
  onSearch: (search: string) => void;
}> = ({ assignees, correlationIds, authenticatedUser, search, onSearch }) => {
  const { selected, onClearSelect } = useSelect();
  const isNoAlertsSelected = Object.keys(selected ?? {}).length === 0;
  const { mutate: mutateAssignAlerts } = useAssignAlertsByIdsMutation({
    onSuccess: onClearSelect,
  });
  const { mutate: mutateAlertsDecision } = useAlertsDecisionByIdsMutation({
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
  const onMutateAlertsDecision: ComponentProps<typeof AlertsDecisionDropdown>['onDecisionSelect'] =
    useCallback(
      decision => () => {
        const screamingSnakeDecision = toScreamingSnakeCase(decision);

        mutateAlertsDecision({
          decision: alertDecisionToState[screamingSnakeDecision],
          alertIds: Object.keys(selected ?? {}),
        });
      },
      [mutateAlertsDecision, selected],
    );
  const decisions = [
    ...['Revert Decision' as const, ...AlertStates]
      .map(state => {
        const screamingSnakeState = toScreamingSnakeCase(state);

        return alertStateToDecision[screamingSnakeState as keyof typeof alertStateToDecision];
      })
      .filter(Boolean)
      .map(decision => ({
        id: decision,
        value: (
          <span
            className={
              decisionToClassName[lowerCase(decision ?? '') as keyof typeof decisionToClassName]
            }
          >
            {capitalize(decision)}
          </span>
        ),
      })),
    ...COMING_SOON_ALERT_DECISIONS.map(decision => ({
      id: decision,
      value: (
        <div className={'flex items-center gap-x-2 text-slate-400'}>
          {capitalize(decision ?? '')} <span className={'text-xs'}>(soon)</span>
        </div>
      ),
    })),
  ];

  return (
    <div className="flex items-end justify-between pb-2">
      <div className="flex gap-6">
        {/*  Uncomment when search is implemented server-side */}
        {/*<Search value={search} onChange={onSearch} />*/}
        <AlertsFilters
          assignees={assignees}
          correlationIds={correlationIds}
          authenticatedUserId={authenticatedUser?.id}
        />
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
          onDecisionSelect={onMutateAlertsDecision}
        />
      </div>
    </div>
  );
};
