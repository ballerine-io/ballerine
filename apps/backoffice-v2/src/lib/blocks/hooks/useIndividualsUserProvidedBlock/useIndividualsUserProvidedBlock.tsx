import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { Button, ctw, TextWithNAFallback } from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { ReadOnlyDetailsCell } from '../../components/ReadOnlyDetailsCell/ReadOnlyDetailsCell';
import { ExtendedJson } from '@/common/types';
import { titleCase } from 'string-ts';

export const useIndividualsUserProvidedBlock = (
  individualsUserProvided: Array<{
    name: string;
    role: string;
    percentageOfOwnership: number;
    collapsibleData: Record<string, unknown>;
  }>,
) => {
  const columnHelper = createColumnHelper<(typeof individualsUserProvided)[number]>();
  const columns = [
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
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: ({ getValue }) => {
        const value = getValue();

        return <TextWithNAFallback>{titleCase(value ?? '')}</TextWithNAFallback>;
      },
    }),
    columnHelper.accessor('percentageOfOwnership', {
      header: '% of Ownership',
      cell: ({ getValue }) => {
        const value = getValue();

        return (
          <TextWithNAFallback>{value || value === 0 ? `${value}%` : value}</TextWithNAFallback>
        );
      },
    }),
  ];

  return useMemo(() => {
    if (Object.keys(individualsUserProvided ?? {}).length === 0) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'heading',
            value: 'Individuals',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell({
            type: 'dataTable',
            value: {
              columns,
              props: {
                scroll: {
                  className: ctw('[&>div]:max-h-[50vh]', {
                    'h-[100px]': individualsUserProvided.length === 0,
                  }),
                },
                cell: { className: '!p-0' },
              },
              data: individualsUserProvided,
              options: {
                enableSorting: false,
              },
              CollapsibleContent: ({ row: individualData }) => {
                const { collapsibleData } = individualData ?? {};

                return (
                  <ReadOnlyDetailsCell
                    value={Object.entries(collapsibleData).map(([key, value]) => ({
                      label: key,
                      value: value as ExtendedJson,
                    }))}
                    props={{
                      config: {
                        parse: {
                          boolean: true,
                          date: true,
                          datetime: true,
                          isoDate: true,
                          nullish: true,
                          url: true,
                        },
                      },
                    }}
                  />
                );
              },
            },
          })
          .build()
          .flat(1),
      })
      .build();
  }, [individualsUserProvided]);
};
