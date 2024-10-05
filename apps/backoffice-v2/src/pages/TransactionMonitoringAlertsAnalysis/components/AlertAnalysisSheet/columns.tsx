import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { TTransactionsList } from '@/domains/transactions/fetchers';
import { Button, buttonVariants } from '@/common/components/atoms/Button/Button';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { titleCase } from 'string-ts';
import { ctw } from '@/common/utils/ctw/ctw';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { TextWithNAFallback } from '@ballerine/ui';

const columnHelper = createColumnHelper<TTransactionsList[number]>();

export const columns = [
  columnHelper.display({
    id: 'collapsible',
    cell: ({ row }) => (
      <Button
        onClick={() => row.toggleExpanded()}
        disabled={row.getCanExpand()}
        variant="ghost"
        size="icon"
        className={`p-[7px]`}
      >
        <ChevronDown
          className={ctw('d-4', {
            'rotate-180': row.getIsExpanded(),
          })}
        />
      </Button>
    ),
  }),
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
  columnHelper.accessor('transactionCorrelationId', {
    cell: info => {
      // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
      const { ref, styles } = useEllipsesWithTitle<HTMLAnchorElement>();
      const transactionId = info.getValue();

      return (
        <div className={`w-[11.8ch]`}>
          <TextWithNAFallback
            className={buttonVariants({
              variant: 'ghost',
              className: '!block !p-0 text-sm',
            })}
            style={styles}
            ref={ref}
          >
            {transactionId}
          </TextWithNAFallback>
        </div>
      );
    },
    header: 'Transaction',
  }),
  columnHelper.accessor('transactionDirection', {
    cell: info => {
      const direction = info.getValue() ?? '';

      return <TextWithNAFallback className="text-sm">{titleCase(direction)}</TextWithNAFallback>;
    },
    header: 'Direction',
  }),
  columnHelper.accessor('transactionBaseAmount', {
    cell: info => {
      const transactionBaseAmount = info.getValue();

      return <TextWithNAFallback className="text-sm">{transactionBaseAmount}</TextWithNAFallback>;
    },
    header: 'Amount',
  }),
  columnHelper.accessor('counterpartyOriginatorName', {
    cell: info => {
      const counterpartyOriginatorName = info.getValue();

      return (
        <TextWithNAFallback className="text-sm">{counterpartyOriginatorName}</TextWithNAFallback>
      );
    },
    header: 'Originator Name',
  }),
  columnHelper.accessor('counterpartyOriginatorCorrelationId', {
    cell: info => {
      const counterpartyOriginatorCorrelationId = info.getValue();

      return (
        <TextWithNAFallback className="text-sm">
          {counterpartyOriginatorCorrelationId}
        </TextWithNAFallback>
      );
    },
    header: 'Originator ID',
  }),
  columnHelper.accessor('counterpartyBeneficiaryName', {
    cell: info => {
      const counterpartyBeneficiaryName = info.getValue();

      return (
        <TextWithNAFallback className="text-sm">{counterpartyBeneficiaryName}</TextWithNAFallback>
      );
    },
    header: 'Beneficiary Name',
  }),
  columnHelper.accessor('counterpartyBeneficiaryCorrelationId', {
    cell: info => {
      const counterpartyBeneficiaryCorrelationId = info.getValue();

      return (
        <TextWithNAFallback className="text-sm">
          {counterpartyBeneficiaryCorrelationId}
        </TextWithNAFallback>
      );
    },
    header: 'Beneficiary ID',
  }),
  columnHelper.accessor('paymentMethod', {
    cell: info => {
      const paymentMethod = info.getValue() ?? '';

      return (
        <TextWithNAFallback className="text-sm">{titleCase(paymentMethod)}</TextWithNAFallback>
      );
    },
    header: 'Payment Method',
  }),
];
