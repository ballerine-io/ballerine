import { Button } from '@/common/components/atoms/Button/Button';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import { ctw } from '@/common/utils/ctw/ctw';
import { IMerchantScreening } from '@/lib/blocks/hooks/useMerchantScreeningBlock/interfaces';
import { isObject, MatchReasonCode } from '@ballerine/common';
import { JsonDialog, TextWithNAFallback, WarningFilledSvg } from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

const columnHelper = createColumnHelper<IMerchantScreening>();

const summaryColumnHelper = createColumnHelper<{
  terminatedMatches: number;
  numberOfInquiries: number;
  checkDate: string;
  fullJsonData: string;
  merchantScreeningInput: Record<PropertyKey, unknown>;
}>();

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
    header: 'Name',
    cell: info => {
      const name = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <WarningFilledSvg className={'mt-1'} width={'20'} height={'20'} />
          <span>{name}</span>
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('exactMatchesAmount', {
    header: 'Exact Matches',
    cell: info => {
      const exactMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-destructive stroke-destructive`} />
          <span>{exactMatches}</span>
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('partialMatchesAmount', {
    header: 'Partial Matches',
    cell: info => {
      const partialMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-warning stroke-warning`} />
          <span>{partialMatches}</span>
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('terminationReasonCode', {
    header: 'Termination Reason',
    cell: info => {
      const terminationReasonCode = info.getValue();

      return (
        <TextWithNAFallback className={`font-semibold`}>
          ({terminationReasonCode}){' '}
          {MatchReasonCode[terminationReasonCode as keyof typeof MatchReasonCode]}
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('dateAdded', {
    header: 'Date Added',
    cell: info => {
      const dateAdded = info.getValue();

      return <TextWithNAFallback className={`font-semibold`}>{dateAdded}</TextWithNAFallback>;
    },
  }),
];

export const terminatedMatchedMerchantsSummaryColumns = [
  summaryColumnHelper.accessor('terminatedMatches', {
    header: 'Terminated Matches',
    cell: info => {
      const terminatedMatches = info.getValue();

      return <TextWithNAFallback checkFalsy={false}>{terminatedMatches}</TextWithNAFallback>;
    },
  }),
  summaryColumnHelper.accessor('numberOfInquiries', {
    header: 'Number of Inquiries',
    cell: info => {
      const numberOfInquiries = info.getValue();

      return <TextWithNAFallback checkFalsy={false}>{numberOfInquiries}</TextWithNAFallback>;
    },
  }),
  summaryColumnHelper.accessor('checkDate', {
    header: 'Check Date',
    cell: info => {
      const checkDate = info.getValue();

      return <TextWithNAFallback>{checkDate}</TextWithNAFallback>;
    },
  }),
  summaryColumnHelper.accessor('merchantScreeningInput', {
    header: 'Checked Properties',
    cell: info => {
      const fullJsonData = info.getValue();

      return (
        <div className={`flex items-end justify-start`}>
          <JsonDialog
            buttonProps={{
              variant: 'link',
              className: 'p-0 text-blue-500',
              disabled: !isObject(fullJsonData) && !Array.isArray(fullJsonData),
            }}
            dialogButtonText={`View`}
            json={JSON.stringify(fullJsonData)}
          />
        </div>
      );
    },
  }),
  summaryColumnHelper.accessor('fullJsonData', {
    header: 'Results',
    cell: info => {
      const fullJsonData = info.getValue();

      return (
        <div className={`flex items-end justify-start`}>
          <JsonDialog
            buttonProps={{
              variant: 'link',
              className: 'p-0 text-blue-500',
              disabled: !isObject(fullJsonData) && !Array.isArray(fullJsonData),
            }}
            dialogButtonText={`View`}
            json={JSON.stringify(fullJsonData)}
          />
        </div>
      );
    },
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
    header: 'Name',
    cell: info => {
      const name = info.getValue();

      return (
        <TextWithNAFallback className={`flex items-center space-x-2 font-semibold`}>
          {name}
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('exactMatchesAmount', {
    header: 'Exact Matches',
    cell: info => {
      const exactMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-destructive stroke-destructive`} />
          <span>{exactMatches}</span>
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('partialMatchesAmount', {
    header: 'Partial Matches',
    cell: info => {
      const partialMatches = info.getValue();

      return (
        <TextWithNAFallback as={'div'} className={`flex items-center space-x-2 font-semibold`}>
          <IndicatorCircle size={11} className={`fill-warning stroke-warning`} />
          <span>{partialMatches}</span>
        </TextWithNAFallback>
      );
    },
  }),
  columnHelper.accessor('dateAdded', {
    header: 'Date Added',
    cell: info => {
      const dateAdded = info.getValue();

      return <TextWithNAFallback className={`font-semibold`}>{dateAdded}</TextWithNAFallback>;
    },
  }),
];
