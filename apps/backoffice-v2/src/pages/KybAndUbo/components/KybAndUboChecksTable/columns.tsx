import { getFullCountryNameByCode } from '@ballerine/common';
import { Badge, severityToClassName, TextWithNAFallback } from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { KybAndUboCheckStatusBadge } from './components/KybAndUboCheckStatusBadge';
import { TKybAndUbosCheck } from '@/domains/checks/fetchers';

dayjs.extend(utc);
dayjs.extend(timezone);

// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    conditional?: true;
    showColumn?: boolean;
  }
}

const columnHelper = createColumnHelper<TKybAndUbosCheck>();

export const useColumns = ({ isDemoAccount = false }) => {
  return useMemo(() => {
    const columns = [
      columnHelper.accessor('input', {
        cell: info => {
          const companyName = info.getValue()?.companyName;
          const isExample =
            ('isExample' in info.row.original && info.row.original.isExample) ?? false;

          return (
            <div className="ms-4 flex flex-col">
              <TextWithNAFallback className="font-semibold">{companyName}</TextWithNAFallback>
              {isExample && (
                <Badge className="py-0.7 mt-2 w-fit rounded-[5px] bg-black/10 px-2 text-xs text-black/60">
                  example
                </Badge>
              )}
            </div>
          );
        },
        header: 'Company Name',
      }),
      columnHelper.accessor('input', {
        cell: info => {
          const registrationNumber = info.getValue()?.registrationNumber;

          return (
            <TextWithNAFallback className="font-semibold">{registrationNumber}</TextWithNAFallback>
          );
        },
        header: 'Registration Number',
      }),
      columnHelper.accessor('input', {
        cell: info => {
          const jurisdictionCode = info.getValue()?.country;
          const countryCode = jurisdictionCode?.split('/')?.[0];
          const state = jurisdictionCode?.split('/')?.[1];
          const country = getFullCountryNameByCode(countryCode ?? '');

          return (
            <div className="flex flex-col">
              <TextWithNAFallback className="font-semibold">{country}</TextWithNAFallback>
              {state && <span className="text-xs text-[#999999]">{state}</span>}
            </div>
          );
        },
        header: 'Country/State',
      }),
      columnHelper.accessor('input', {
        cell: info => {
          const businessId = info.getValue()?.businessId;

          return <TextWithNAFallback className="font-semibold">{businessId}</TextWithNAFallback>;
        },
        header: 'Merchant ID',
      }),
      columnHelper.accessor('riskLevel', {
        cell: info => {
          const riskLevel = info.getValue();

          if (!riskLevel) {
            return <TextWithNAFallback className="font-semibold">N/A</TextWithNAFallback>;
          }

          return (
            <Badge className={`rounded-[5px] px-2 text-xs ${severityToClassName[riskLevel]}`}>
              {riskLevel}
            </Badge>
          );
        },
        header: 'Risk Level',
      }),
      // columnHelper.accessor('findings', {
      //   cell: info => {
      //     const findings = info.getValue() || [];

      //     // Mock findings if none exist
      //     const violations =
      //       findings.length > 0
      //         ? findings
      //         : [
      //             {
      //               id: 'finding-1',
      //               name: 'Suspicious business activity',
      //               riskLevel: 'high',
      //             },
      //             {
      //               id: 'finding-2',
      //               name: 'Incomplete company documentation',
      //               riskLevel: 'high',
      //             },
      //             {
      //               id: 'finding-3',
      //               name: 'Beneficial owner verification failed',
      //               riskLevel: 'medium',
      //             },
      //             {
      //               id: 'finding-4',
      //               name: 'Company address mismatch',
      //               riskLevel: 'medium',
      //             },
      //             {
      //               id: 'finding-5',
      //               name: 'Unusual corporate structure',
      //               riskLevel: 'medium',
      //             },
      //           ];

      //     return (
      //       <ContentTooltip
      //         description={
      //           <>
      //             <p className="mb-4 text-base font-bold">Findings</p>

      //             {violations.slice(0, 4).map((violation, index) => (
      //               <div key={index} className="space-x-1 text-sm">
      //                 <WarningFilledSvg
      //                   className={ctw('inline-block d-5', {
      //                     'text-warning':
      //                       typeof violation === 'object' && violation.riskLevel === 'high',
      //                     'text-slate-500':
      //                       typeof violation === 'object' &&
      //                       (violation.riskLevel === 'medium' || !violation.riskLevel),
      //                   })}
      //                 />
      //                 <span className="text-slate-500">
      //                   {typeof violation === 'object' ? violation.name : violation}
      //                 </span>
      //               </div>
      //             ))}
      //             {violations.length > 4 && (
      //               <div className="mt-2 text-sm text-slate-500">
      //                 + {violations.length - 4} additional finding
      //                 {violations.length - 4 > 1 ? 's' : ''}
      //               </div>
      //             )}
      //           </>
      //         }
      //         props={{
      //           tooltipTrigger: { className: 'mx-auto pr-0' },
      //           tooltipContent: {
      //             align: 'center',
      //             side: 'top',
      //             className: 'bg-background text-primary',
      //           },
      //         }}
      //       >
      //         <div
      //           className={ctw(
      //             'flex items-center justify-center rounded-full text-xs font-bold d-5',
      //             {
      //               'bg-warning/20 text-warning': violations.some(
      //                 v => typeof v === 'object' && v.riskLevel === 'high',
      //               ),
      //               'bg-slate-500/20 text-slate-500': !violations.some(
      //                 v => typeof v === 'object' && v.riskLevel === 'high',
      //               ),
      //             },
      //           )}
      //         >
      //           {violations.length}
      //         </div>
      //       </ContentTooltip>
      //     );
      //   },
      //   header: () => <p className="text-center">Findings</p>,
      // }),
      columnHelper.accessor('createdAt', {
        cell: info => {
          const displayDate = info.getValue();

          // Convert UTC time to local browser time
          const localDateTime = dayjs.utc(displayDate).local();

          const date = localDateTime.format('MMM DD, YYYY');
          const time = localDateTime.format('HH:mm');

          return (
            <div className={`flex flex-col space-y-0.5`}>
              <span>{date}</span>
              <span className={`text-xs text-[#999999]`}>{time}</span>
            </div>
          );
        },
        header: 'Created At',
      }),
      columnHelper.accessor('status', {
        cell: ({ getValue }) => {
          const status = getValue();

          return <KybAndUboCheckStatusBadge status={status} />;
        },
        header: 'Status',
      }),
    ];

    return columns.filter(column => {
      const meta = column.meta;

      if (meta?.conditional) {
        return meta.showColumn;
      }

      return true;
    });
  }, [isDemoAccount]);
};
