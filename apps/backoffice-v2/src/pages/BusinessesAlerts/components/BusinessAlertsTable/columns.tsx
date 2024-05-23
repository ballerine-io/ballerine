import { AvatarFallback } from '@/common/components/atoms/Avatar_/Avatar.Fallback';
import { AvatarImage } from '@/common/components/atoms/Avatar_/Avatar.Image';
import { Avatar } from '@/common/components/atoms/Avatar_/Avatar_';
import { IndeterminateCheckbox } from '@/common/components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import { ctw } from '@/common/utils/ctw/ctw';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { TBusinessAlerts } from '@/domains/business-alerts/fetchers';
import { getSeverityFromRiskScore } from '@/pages/BusinessesAlerts/components/BusinessAlertsTable/utils/get-severity-from-risk-score';
import {
  severityToClassName,
  severityToTextClassName,
} from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/severity-to-class-name';
import { Badge } from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { UserCircle2 } from 'lucide-react';
import { ComponentProps } from 'react';
import { titleCase } from 'string-ts';

const columnHelper = createColumnHelper<
  TBusinessAlerts[number] & {
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
    header: 'Created At',
  }),
  columnHelper.accessor('additionalInfo', {
    cell: info => {
      const { businessCompanyName } = info.getValue();

      return (
        <span className={`whitespace-nowrap font-semibold`}>{valueOrNA(businessCompanyName)}</span>
      );
    },
    header: 'Business',
  }),
  columnHelper.accessor('additionalInfo', {
    cell: info => {
      const { alertReason } = info.getValue();

      return <div className="min-w-[250px] font-semibold">{alertReason}</div>;
    },
    header: 'Reason',
  }),
  columnHelper.accessor('additionalInfo', {
    cell: info => {
      const { severity } = info.getValue();

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
          {titleCase(severity ?? '')}
        </TextWithNAFallback>
      );
    },
    header: 'Severity',
  }),
  columnHelper.accessor('additionalInfo', {
    cell: info => {
      const { riskScore } = info.getValue();
      const severity = getSeverityFromRiskScore(riskScore);

      return (
        <div className="flex items-center gap-2">
          <TextWithNAFallback
            className={ctw(
              severityToTextClassName[
                (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
              ],
              'py-0.5 font-bold',
            )}
          >
            {riskScore}
          </TextWithNAFallback>
          <TextWithNAFallback
            as={Badge}
            className={ctw(
              severityToClassName[
                (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
              ],
              'w-20 py-0.5 font-bold',
            )}
          >
            {titleCase(severity ?? '')}
          </TextWithNAFallback>
        </div>
      );
    },
    header: 'Report Risk Score',
  }),
  columnHelper.accessor('assignee', {
    cell: info => {
      const assignee = info.getValue();

      return (
        <div className={`flex items-center gap-x-3`}>
          {!assignee && <UserCircle2 className={'stroke-[#E4E4E7]'} size={22} />}
          {assignee && (
            <Avatar className={`d-[1.375rem]`}>
              <AvatarImage src={assignee?.avatarUrl} />
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

      return (
        <TextWithNAFallback className={`font-semibold`}>{titleCase(status)}</TextWithNAFallback>
      );
    },
    header: 'Status',
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
