import { createColumnHelper } from '@tanstack/react-table';
import { TAlertsList } from '@/domains/alerts/fetchers';
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

const columnHelper = createColumnHelper<TAlertsList[number]>();

export const columns = [
  columnHelper.accessor('dataTimestamp', {
    cell: info => {
      const value = info.getValue();

      if (!value) {
        return <TextWithNAFallback>{value}</TextWithNAFallback>;
      }

      const date = dayjs(value).format('MMM DD, YYYY');
      const time = dayjs(value).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('merchant', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback>{value}</TextWithNAFallback>;
    },
    header: 'Merchant',
  }),
  columnHelper.accessor('severity', {
    cell: info => {
      const value = info.getValue();

      return (
        <TextWithNAFallback
          as={Badge}
          className={ctw(
            severityToClassName[
              (value?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
            ],
            'w-20 py-0.5 font-bold',
          )}
        >
          {value}
        </TextWithNAFallback>
      );
    },
    header: 'Severity',
  }),
  columnHelper.accessor('alertDetails', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback>{value}</TextWithNAFallback>;
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
      const value = info.getValue();

      return (
        <div className={`flex items-center gap-x-3`}>
          {!value && <UserCircle2 className={'stroke-[#E4E4E7]'} size={22} />}
          {value && (
            <Avatar className={`d-[1.375rem]`}>
              <AvatarImage />
              <AvatarFallback className={'bg-[#DCE1E8] text-xs'}>
                {createInitials(value?.fullName)}
              </AvatarFallback>
            </Avatar>
          )}
          <TextWithNAFallback>{value?.fullName}</TextWithNAFallback>
        </div>
      );
    },
    header: 'Assignee',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className={`font-semibold`}>{value}</TextWithNAFallback>;
    },
    header: 'Status',
  }),
  columnHelper.accessor('decision', {
    cell: info => {
      const value = info.getValue();

      return (
        <TextWithNAFallback
          className={ctw({
            'font-bold': !!value,
          })}
        >
          {value}
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
