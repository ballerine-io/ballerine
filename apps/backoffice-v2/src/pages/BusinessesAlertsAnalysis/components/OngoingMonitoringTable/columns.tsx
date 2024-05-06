import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';

const columnHelper = createColumnHelper<{
  ongoingCreationDate: string;
  riskScore: number;
  reportFileId: string;
}>();

export const columns = [
  columnHelper.accessor('ongoingCreationDate', {
    cell: info => {
      const dateValue = info.getValue();
      const date = dayjs(dateValue).format('MMM DD, YYYY');
      const time = dayjs(dateValue).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('riskScore', {
    cell: info => {
      const dateValue = info.getValue();
      const date = dayjs(dateValue).format('MMM DD, YYYY');
      const time = dayjs(dateValue).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Risk Score',
  }),
  columnHelper.accessor('reportFileId', {
    cell: info => {
      return <Download color="#007AFF" />;
    },
    header: '',
  }),
];
