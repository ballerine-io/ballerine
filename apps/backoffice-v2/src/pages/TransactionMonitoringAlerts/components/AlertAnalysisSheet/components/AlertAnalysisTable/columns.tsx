import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';

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
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm">{value}</TextWithNAFallback>;
    },
    header: 'Transaction',
  }),
  columnHelper.accessor('direction', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm">{value}</TextWithNAFallback>;
    },
    header: 'Direction',
  }),
  columnHelper.accessor('amount', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm">{value}</TextWithNAFallback>;
    },
    header: 'Amount',
  }),
  columnHelper.accessor('business', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm font-semibold">{value}</TextWithNAFallback>;
    },
    header: 'Business',
  }),
  columnHelper.accessor('businessId', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm font-semibold">{value}</TextWithNAFallback>;
    },
    header: 'Business ID',
  }),
  columnHelper.accessor('counterPartyName', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm font-semibold">{value}</TextWithNAFallback>;
    },
    header: 'Counterparty Name',
  }),
  columnHelper.accessor('counterPartyId', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm font-semibold">{value}</TextWithNAFallback>;
    },
    header: 'Counterparty ID',
  }),
  columnHelper.accessor('counterPartyName', {
    cell: info => {
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm font-semibold">{value}</TextWithNAFallback>;
    },
    header: 'Counterparty Institution',
  }),
];
