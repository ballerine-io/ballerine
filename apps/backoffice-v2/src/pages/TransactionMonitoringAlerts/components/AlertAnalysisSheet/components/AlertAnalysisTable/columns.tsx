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
  columnHelper.accessor('transactionId', {
    cell: info => {
      const transactionId = info.getValue();

      return <TextWithNAFallback className="text-sm">{transactionId}</TextWithNAFallback>;
    },
    header: 'Transaction',
  }),
  columnHelper.accessor('direction', {
    cell: info => {
      const direction = info.getValue();

      return <TextWithNAFallback className="text-sm">{direction}</TextWithNAFallback>;
    },
    header: 'Direction',
  }),
  columnHelper.accessor('amount', {
    cell: info => {
      const amount = info.getValue();

      return <TextWithNAFallback className="text-sm">{amount}</TextWithNAFallback>;
    },
    header: 'Amount',
  }),
  columnHelper.accessor('business', {
    cell: info => {
      const business = info.getValue();

      return <TextWithNAFallback className="text-sm font-semibold">{business}</TextWithNAFallback>;
    },
    header: 'Business',
  }),
  columnHelper.accessor('businessId', {
    cell: info => {
      const businessId = info.getValue();

      return (
        <TextWithNAFallback className="text-sm font-semibold">{businessId}</TextWithNAFallback>
      );
    },
    header: 'Business ID',
  }),
  columnHelper.accessor('counterPartyName', {
    cell: info => {
      const counterPartyName = info.getValue();

      return (
        <TextWithNAFallback className="text-sm font-semibold">
          {counterPartyName}
        </TextWithNAFallback>
      );
    },
    header: 'Counterparty Name',
  }),
  columnHelper.accessor('counterPartyId', {
    cell: info => {
      const counterPartyId = info.getValue();

      return (
        <TextWithNAFallback className="text-sm font-semibold">{counterPartyId}</TextWithNAFallback>
      );
    },
    header: 'Counterparty ID',
  }),
  columnHelper.accessor('counterPartyName', {
    cell: info => {
      const counterPartyName = info.getValue();

      return (
        <TextWithNAFallback className="text-sm font-semibold">
          {counterPartyName}
        </TextWithNAFallback>
      );
    },
    header: 'Counterparty Institution',
  }),
];
