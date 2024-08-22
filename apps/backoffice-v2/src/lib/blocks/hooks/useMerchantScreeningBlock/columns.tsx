import { MatchReasonCode } from '@/domains/merchant-screening/constants';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/common/components/atoms/Button/Button';
import { ChevronDown } from 'lucide-react';
import { ctw } from '@/common/utils/ctw/ctw';
import { TextWithNAFallback, WarningFilledSvg } from '@ballerine/ui';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import React from 'react';
import { IMerchantScreening } from '@/lib/blocks/hooks/useMerchantScreeningBlock/interfaces';

const columnHelper = createColumnHelper<
  IMerchantScreening & {
    exactMatches: number;
    partialMatches: number;
  }
>();

export const terminatedMatchedMerchantsColumns = [
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
  columnHelper.accessor('name', {
    cell: info => {
      const name = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <WarningFilledSvg className={'mt-1'} width={'20'} height={'20'} />
          <span>{name}</span>
        </TextWithNAFallback>
      );
    },
    header: 'Name',
  }),
  columnHelper.accessor('exactMatchesAmount', {
    cell: info => {
      const exactMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-destructive stroke-destructive`} />
          <span>{exactMatches}</span>
        </TextWithNAFallback>
      );
    },
    header: 'Exact Matches',
  }),
  columnHelper.accessor('partialMatchesAmount', {
    cell: info => {
      const partialMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-warning stroke-warning`} />
          <span>{partialMatches}</span>
        </TextWithNAFallback>
      );
    },
    header: 'Partial Matches',
  }),
  columnHelper.accessor('terminationReasonCode', {
    cell: info => {
      const terminationReasonCode = info.getValue();

      return (
        <TextWithNAFallback className={`font-semibold`}>
          ({terminationReasonCode}){' '}
          {MatchReasonCode[terminationReasonCode as keyof typeof MatchReasonCode]}
        </TextWithNAFallback>
      );
    },
    header: 'Termination Reason',
  }),
  columnHelper.accessor('dateAdded', {
    cell: info => {
      const dateAdded = info.getValue();

      return <TextWithNAFallback className={`font-semibold`}>{dateAdded}</TextWithNAFallback>;
    },
    header: 'Date Added',
  }),
];

export const inquiredMatchedMerchantsColumns = [
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
  columnHelper.accessor('name', {
    cell: info => {
      const name = info.getValue();

      return (
        <TextWithNAFallback className={`flex items-center space-x-2 font-semibold`}>
          {name}
        </TextWithNAFallback>
      );
    },
    header: 'Name',
  }),
  columnHelper.accessor('exactMatchesAmount', {
    cell: info => {
      const exactMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-destructive stroke-destructive`} />
          <span>{exactMatches}</span>
        </TextWithNAFallback>
      );
    },
    header: 'Exact Matches',
  }),
  columnHelper.accessor('partialMatchesAmount', {
    cell: info => {
      const partialMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-warning stroke-warning`} />
          <span>{partialMatches}</span>
        </TextWithNAFallback>
      );
    },
    header: 'Partial Matches',
  }),
  columnHelper.accessor('dateAdded', {
    cell: info => {
      const dateAdded = info.getValue();

      return <TextWithNAFallback className={`font-semibold`}>{dateAdded}</TextWithNAFallback>;
    },
    header: 'Date Added',
  }),
];
