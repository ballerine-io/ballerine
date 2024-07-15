import { toTitleCase } from 'string-ts';
import { ChevronDown } from 'lucide-react';
import React, { ComponentProps, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { AmlMatch } from '@/lib/blocks/components/AmlBlock/AmlMatch';
import { amlAdapter } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import { Button } from '@/common/components/atoms/Button/Button';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';

export const useAmlBlock = (data: Array<TWorkflowById['context']['aml']>) => {
  const amlBlock = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return data.flatMap(aml => {
      if (!aml || !Object.keys(aml ?? {}).length) return [];

      const { totalMatches, fullReport, dateOfCheck, matches } = amlAdapter(aml);

      const columnHelper = createColumnHelper<ReturnType<typeof amlAdapter>['matches'][number]>();

      return [
        ...createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'table',
            value: {
              props: {
                table: {
                  className: 'my-8',
                },
              },
              columns: [
                {
                  accessorKey: 'totalMatches',
                  header: 'Total Matches',
                  cell: props => {
                    const value = props.getValue();
                    const variant: ComponentProps<typeof Badge>['variant'] =
                      value === 0 ? 'success' : 'warning';

                    return (
                      <Badge variant={variant} className={`mb-1 rounded-lg px-2 py-1 font-bold`}>
                        {value} {value === 1 ? 'match' : 'matches'}
                      </Badge>
                    );
                  },
                },
                {
                  accessorKey: 'fullReport',
                  header: 'Full Report',
                },
                {
                  accessorKey: 'dateOfCheck',
                  header: 'Date Of Check',
                },
                {
                  accessorKey: 'scanStatus',
                  header: 'Scan Status',
                  cell: props => {
                    const value = props.getValue();
                    const variant: ComponentProps<typeof Badge>['variant'] = 'success';

                    return (
                      <Badge variant={variant} className={`mb-1 rounded-lg px-2 py-1 font-bold`}>
                        <>{value}</>
                      </Badge>
                    );
                  },
                },
              ],
              data: [
                {
                  totalMatches,
                  fullReport,
                  dateOfCheck,
                  scanStatus: 'Completed',
                },
              ],
            },
          })
          .addCell({
            type: 'dataTable',
            value: {
              data: matches,
              props: {
                scroll: { className: ctw('h-[50vh]', { 'h-[100px]': totalMatches === 0 }) },
                cell: { className: '!p-0' },
              },
              CollapsibleContent: ({ row: match }) => <AmlMatch match={match} />,
              columns: [
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
                columnHelper.display({
                  id: 'index',
                  cell: info => {
                    const index = info.cell.row.index + 1;

                    return (
                      <TextWithNAFallback className={`p-1 font-semibold`}>
                        {index}
                      </TextWithNAFallback>
                    );
                  },
                  header: '#',
                }),
                {
                  accessorKey: 'matchedName',
                  header: 'Matched Name',
                },
                {
                  accessorKey: 'countries',
                  header: 'Countries',
                },
                columnHelper.accessor('matchTypes', {
                  header: 'Match Type',
                  cell: info => {
                    const matchTypes = info.getValue();

                    return <TextWithNAFallback>{toTitleCase(matchTypes)}</TextWithNAFallback>;
                  },
                }),
                columnHelper.accessor('pep', {
                  cell: info => {
                    const pepLength = info.getValue().length;

                    return <TextWithNAFallback>{pepLength}</TextWithNAFallback>;
                  },
                  header: 'PEP',
                }),
                columnHelper.accessor('warnings', {
                  cell: info => {
                    const warningsLength = info.getValue().length;

                    return <TextWithNAFallback>{warningsLength}</TextWithNAFallback>;
                  },
                  header: 'Warnings',
                }),
                columnHelper.accessor('sanctions', {
                  cell: info => {
                    const sanctionsLength = info.getValue().length;

                    return <TextWithNAFallback>{sanctionsLength}</TextWithNAFallback>;
                  },
                  header: 'Sanctions',
                }),
                columnHelper.accessor('adverseMedia', {
                  cell: info => {
                    const adverseMediaLength = info.getValue().length;

                    return <TextWithNAFallback>{adverseMediaLength}</TextWithNAFallback>;
                  },
                  header: 'Adverse Media',
                }),
                columnHelper.accessor('fitnessProbity', {
                  cell: info => {
                    const fitnessProbityLength = info.getValue().length;

                    return <TextWithNAFallback>{fitnessProbityLength}</TextWithNAFallback>;
                  },
                  header: 'Fitness Probity',
                }),
                columnHelper.accessor('other', {
                  cell: info => {
                    return <TextWithNAFallback>{info.getValue().length}</TextWithNAFallback>;
                  },
                  header: 'Other',
                }),
              ],
            },
          })
          .build()
          .flat(1),
      ];
    });
  }, [data]);

  if (!amlBlock.length) {
    return [];
  }

  return createBlocksTyped()
    .addBlock()
    .addCell({
      id: 'header',
      type: 'heading',
      value: 'Sanctions Screening Results',
    })
    .build()
    .concat(amlBlock)
    .flat(1);
};
