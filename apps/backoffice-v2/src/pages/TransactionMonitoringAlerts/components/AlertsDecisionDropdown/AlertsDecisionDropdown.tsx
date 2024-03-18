import React, { FunctionComponent, ReactNode } from 'react';
import { TObjectValues } from '@/common/types';
import { alertStateToDecision } from '@/domains/alerts/fetchers';
import { Dropdown } from '@/common/components/molecules/Dropdown/Dropdown';
import { DoubleCaretSvg } from '@/common/components/atoms/icons';
import { COMING_SOON_ALERT_DECISIONS } from '@/pages/TransactionMonitoringAlerts/constants';

export const AlertsDecisionDropdown: FunctionComponent<{
  decisions: Array<{
    id: string;
    value: ReactNode;
    isDisabled?: boolean;
  }>;
  isDisabled: boolean;
  onDecisionSelect: (decision: TObjectValues<typeof alertStateToDecision>) => () => void;
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
          disabled={COMING_SOON_ALERT_DECISIONS.includes(item?.id)}
          onClick={onDecisionSelect(item?.id)}
        >
          {item?.value}
        </DropdownItem>
      )}
    </Dropdown>
  );
};
