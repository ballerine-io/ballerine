import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

export type AlertAnalysisItem = {
  date: string;
  transactionId: string;
  direction: string;
  amount: string;
  business: string;
  businessId: string;
  counterPartyName: string;
  counterPartyId: string;
  counterPartyInstitution: string;
};

const columnHelper = createColumnHelper<AlertAnalysisItem>();

export const columns = [
  columnHelper.accessor('date', {
    cell: info => {
      const date = dayjs(info.getValue()).format('MMM DD, YYYY');
      const time = dayjs(info.getValue()).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('transactionId', {
    cell: info => <span className="text-sm">{info.getValue()}</span>,
    header: 'Transaction',
  }),
  columnHelper.accessor('direction', {
    cell: info => <span className="text-sm">{info.getValue()}</span>,
    header: 'Direction',
  }),
  columnHelper.accessor('amount', {
    cell: info => <span className="text-sm">{info.getValue()}</span>,
    header: 'Amount',
  }),
  columnHelper.accessor('business', {
    cell: info => <strong className="text-sm">{info.getValue()}</strong>,
    header: 'Business',
  }),
  columnHelper.accessor('businessId', {
    cell: info => <strong className="text-sm">{info.getValue()}</strong>,
    header: 'Business ID',
  }),
  columnHelper.accessor('counterPartyName', {
    cell: info => <strong className="text-sm">{info.getValue()}</strong>,
    header: 'Counterparty Name',
  }),
  columnHelper.accessor('counterPartyId', {
    cell: info => <strong className="text-sm">{info.getValue()}</strong>,
    header: 'Counterparty ID',
  }),
  columnHelper.accessor('counterPartyName', {
    cell: info => <strong className="text-sm">{info.getValue()}</strong>,
    header: 'Counterparty Institution',
  }),
];
