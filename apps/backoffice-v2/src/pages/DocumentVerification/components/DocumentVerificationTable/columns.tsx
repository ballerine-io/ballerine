import { Badge, TextWithNAFallback } from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Files } from 'lucide-react';
import { useMemo } from 'react';
import { titleCase } from 'string-ts';

import { ctw } from '@/common/utils/ctw/ctw';
import { TDocumentVerificationCheck } from '@/domains/document-verification/fetchers';

const columnHelper = createColumnHelper<TDocumentVerificationCheck>();

export const useColumns = ({ isDemoAccount = false }) => {
  return useMemo(() => {
    const columns = [
      // Company Name column
      columnHelper.accessor('companyName', {
        cell: info => {
          const companyName = info.getValue() || 'Unknown Company';

          return (
            <div className="ms-4 flex flex-col">
              <TextWithNAFallback className="font-semibold">{companyName}</TextWithNAFallback>
            </div>
          );
        },
        header: 'Company Name',
      }),

      // Document Count column
      columnHelper.accessor('documentNames', {
        cell: info => {
          const names = info.getValue() || ['hello', 'world']; //info.getValue().documentNames.length;

          return (
            <div className="flex items-center">
              <Files className="mr-2 h-4 w-4 text-gray-500" />
              <span>{names.length}</span>
            </div>
          );
        },
        header: 'Documents',
      }),

      // Date Created column
      columnHelper.accessor('createdAt', {
        cell: info => {
          const createdAt = info.getValue();

          // Convert UTC time to local browser time
          const localDateTime = dayjs(createdAt).isValid() ? dayjs(createdAt) : dayjs();

          const date = localDateTime.format('MMM DD, YYYY');
          const time = localDateTime.format('HH:mm');

          return (
            <div className={`flex flex-col space-y-0.5`}>
              <span>{date}</span>
              <span className={`text-xs text-[#999999]`}>{time}</span>
            </div>
          );
        },
        header: 'Date Created',
      }),

      // Status column
      columnHelper.accessor('status', {
        cell: ({ getValue }) => {
          const status = getValue();
          const statusToLabelMap = {
            pending: 'Pending',
            verified: 'Verified',
            rejected: 'Rejected',
          };

          return (
            <Badge
              className={ctw(`h-6 space-x-1 text-sm font-medium`, {
                'bg-[#E3E2E0]': status === 'pending',
                'bg-[#DBEDDB]': status === 'verified',
                'bg-[#ECA1A5]': status === 'rejected',
              })}
            >
              <span
                className={ctw(`h-2 w-2 rounded-full`, {
                  'bg-[#91918E]': status === 'pending',
                  'bg-[#6C9B7D]': status === 'verified',
                  'bg-[#DF2222]': status === 'rejected',
                })}
              >
                &nbsp;
              </span>
              <span
                style={{ width: '100%' }}
                className={ctw('text-sm', {
                  'text-[#32302C]': status === 'pending',
                  'text-[#1C3829]': status === 'verified' || status === 'rejected',
                })}
              >
                {statusToLabelMap[status as keyof typeof statusToLabelMap] ||
                  titleCase(status || '')}
              </span>
            </Badge>
          );
        },
        header: 'Status',
      }),
    ];

    return columns;
  }, [isDemoAccount]);
};
