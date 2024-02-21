import { createColumnHelper } from '@tanstack/react-table';
import { TAlertsList, TAlertState } from '@/domains/alerts/fetchers';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import dayjs from 'dayjs';
import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { UserCircle2 } from 'lucide-react';
import { Avatar } from '@/common/components/atoms/Avatar_/Avatar_';
import { AvatarImage } from '@/common/components/atoms/Avatar_/Avatar.Image';
import { AvatarFallback } from '@/common/components/atoms/Avatar_/Avatar.Fallback';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import React, { ComponentProps } from 'react';
import { severityToClassName } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/severity-to-class-name';
import { IndeterminateCheckbox } from '@/common/components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { SnakeCase, titleCase } from 'string-ts';
import { toScreamingSnakeCase } from '@/common/utils/to-screaming-snake-case/to-screaming-snake-case';

const columnHelper = createColumnHelper<
  TAlertsList[number] & {
    // TODO: Change type once decisions PR is merged
    // Computed from `alert.state`
    decision: string;
  }
>();

export const columns = [
  columnHelper.accessor('dataTimestamp', {
    cell: info => {
      const dataTimestamp = info.getValue();

      if (!dataTimestamp) {
        return <TextWithNAFallback>{dataTimestamp}</TextWithNAFallback>;
      }

      const date = dayjs(dataTimestamp).format('MMM DD, YYYY');
      const time = dayjs(dataTimestamp).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('merchant.name', {
    cell: info => {
      const merchant = info.getValue();

      return <TextWithNAFallback>{merchant}</TextWithNAFallback>;
    },
    header: 'Merchant',
  }),
  columnHelper.accessor('severity', {
    cell: info => {
      const severity = info.getValue();

      return (
        <TextWithNAFallback
          as={Badge}
          className={ctw(
            severityToClassName[
              (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
            ],
            'w-20 py-0.5 font-bold',
          )}
        >
          {severity}
        </TextWithNAFallback>
      );
    },
    header: 'Severity',
  }),
  columnHelper.accessor('alertDetails', {
    cell: info => {
      const alertDetails = info.getValue();

      return <TextWithNAFallback>{alertDetails}</TextWithNAFallback>;
    },
    header: 'Alert Details',
  }),
  // columnHelper.accessor('amountOfTxs', {
  //   cell: info => {
  //     const value = info.getValue();
  //
  //     return <TextWithNAFallback>{value}</TextWithNAFallback>;
  //   },
  //   header: '# of TXs',
  // }),
  columnHelper.accessor('assignee', {
    cell: info => {
      const assignee = info.getValue();

      return (
        <div className={`flex items-center gap-x-3`}>
          {!assignee && <UserCircle2 className={'stroke-[#E4E4E7]'} size={22} />}
          {assignee && (
            <Avatar className={`d-[1.375rem]`}>
              <AvatarImage />
              <AvatarFallback className={'bg-[#DCE1E8] text-xs'}>
                {createInitials(assignee?.fullName)}
              </AvatarFallback>
            </Avatar>
          )}
          <TextWithNAFallback>{assignee?.fullName}</TextWithNAFallback>
        </div>
      );
    },
    header: 'Assignee',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue();

      return <TextWithNAFallback className={`font-semibold`}>{status}</TextWithNAFallback>;
    },
    header: 'Status',
  }),
  columnHelper.accessor('decision', {
    cell: info => {
      const decision = info.getValue();
      const screamingSnakeDecision = toScreamingSnakeCase(decision ?? '');
      const decisionToTextColor = {
        CLEARED: 'text-success',
        REJECTED: 'text-destructive',
      } as const satisfies Record<
        Extract<Uppercase<SnakeCase<TAlertState>>, 'CLEARED' | 'REJECTED'>,
        ComponentProps<typeof TextWithNAFallback>['className']
      >;

      return (
        <TextWithNAFallback
          className={ctw({
            'font-bold': !!screamingSnakeDecision,
            [decisionToTextColor[screamingSnakeDecision as keyof typeof decisionToTextColor]]:
              !!screamingSnakeDecision,
          })}
        >
          {titleCase(decision ?? '')}
        </TextWithNAFallback>
      );
    },
    header: 'Decision',
  }),
  columnHelper.display({
    id: 'select',
    cell: ({ row }) => {
      return (
        <IndeterminateCheckbox
          {...({
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onCheckedChange: row.getToggleSelectedHandler(),
            disabled: !row.getCanSelect(),
          } satisfies ComponentProps<typeof IndeterminateCheckbox>)}
          className={'border-[#E5E7EB]'}
        />
      );
    },
    header: ({ table }) => {
      return (
        <IndeterminateCheckbox
          {...({
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onCheckedChange: checked =>
              table.getToggleAllRowsSelectedHandler()({
                target: { checked },
              }),
          } satisfies ComponentProps<typeof IndeterminateCheckbox>)}
          className={'border-[#E5E7EB]'}
        />
      );
    },
  }),
];
