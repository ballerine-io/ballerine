import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { TTransactionsList } from '@/domains/transactions/fetchers';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { titleCase } from 'string-ts';

const columnHelper = createColumnHelper<TTransactionsList[number]>();

export const columns = [
  columnHelper.accessor('transactionDate', {
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
  columnHelper.accessor('id', {
    cell: info => {
      const transactionId = info.getValue();
      // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
      const { ref, styles } = useEllipsesWithTitle<HTMLAnchorElement>();
      const value = info.getValue();

      return <TextWithNAFallback className="text-sm">{transactionId}</TextWithNAFallback>;
      return (
        <div className={`w-[11.8ch]`}>
          <TextWithNAFallback
            // as={Link}
            // to={'/en/transaction-monitoring/transactions/:transactionId'}
            className={buttonVariants({
              variant: 'link',
              className: '!block cursor-pointer !p-0 text-sm !text-blue-500',
            })}
            style={styles}
            ref={ref}
          >
            {value}
          </TextWithNAFallback>
        </div>
      );
    },
    header: 'Transaction',
  }),
  columnHelper.accessor('transactionDirection', {
    cell: info => {
      const direction = info.getValue();

      return <TextWithNAFallback className="text-sm">{direction}</TextWithNAFallback>;
    },
    header: 'Direction',
  }),
  columnHelper.accessor('transactionAmount', {
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
  columnHelper.accessor('counterpartyOriginatorName', {
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
  columnHelper.accessor('counterpartyOriginatorId', {
    cell: info => {
      const counterPartyId = info.getValue();

      return (
        <TextWithNAFallback className="text-sm font-semibold">{counterPartyId}</TextWithNAFallback>
      );
    },
    header: 'Counterparty ID',
  }),
  columnHelper.accessor('paymentMethod', {
    cell: info => {
      const paymentMethod = info.getValue();

      return (
        <TextWithNAFallback className="text-sm font-semibold">
          {titleCase(paymentMethod)}
        </TextWithNAFallback>
      );
    },
    header: 'Payment Method',
  }),
];
