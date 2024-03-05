import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ComponentProps, useMemo } from 'react';
import { Badge } from '@ballerine/ui';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import { amlAdapter } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const useAmlBlock = (data: Array<TWorkflowById['context']['aml']>) => {
  const amlBlock = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return data.flatMap(aml => {
      if (!aml || !Object.keys(aml ?? {}).length) return [];

      const { totalMatches, fullReport, dateOfCheck, matches } = amlAdapter(aml);

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
            type: 'table',
            value: {
              props: {
                table: {
                  className: 'my-8',
                },
              },
              columns: [
                {
                  accessorKey: 'matchedName',
                  header: 'Matched Name',
                },
                {
                  accessorKey: 'dateOfBirth',
                  header: 'Date Of Birth',
                },
                {
                  accessorKey: 'countries',
                  header: 'Countries',
                },
                {
                  accessorKey: 'aka',
                  header: 'AKA',
                },
              ],
              data: matches,
            },
          })
          .build()
          .flat(1),
        ...(matches?.flatMap(({ warnings, sanctions, pep, adverseMedia }, index) =>
          createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'subheading',
                  value: `Match ${index + 1}`,
                  props: {
                    className: 'text-lg block my-6',
                  },
                })
                .addCell({
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8 w-full',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'warning',
                        header: 'Warning',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <div className={'flex space-x-2'}>
                              <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                              <span>{value}</span>
                            </div>
                          );
                        },
                      },
                      {
                        accessorKey: 'date',
                        header: 'Date',
                      },
                      {
                        accessorKey: 'source',
                        header: 'Source URL',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <a
                              className={buttonVariants({
                                variant: 'link',
                                className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                              })}
                              target={'_blank'}
                              rel={'noopener noreferrer'}
                              href={value}
                            >
                              Link
                            </a>
                          );
                        },
                      },
                    ],
                    data: warnings,
                  },
                })
                .addCell({
                  type: 'table',
                  props: {
                    table: {
                      className: 'my-8 w-full',
                    },
                  },
                  value: {
                    columns: [
                      {
                        accessorKey: 'sanction',
                        header: 'Sanction',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <div className={'flex space-x-2'}>
                              <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                              <span>{value}</span>
                            </div>
                          );
                        },
                      },
                      {
                        accessorKey: 'date',
                        header: 'Date',
                      },
                      {
                        accessorKey: 'source',
                        header: 'Source URL',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <a
                              className={buttonVariants({
                                variant: 'link',
                                className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                              })}
                              target={'_blank'}
                              rel={'noopener noreferrer'}
                              href={value}
                            >
                              Link
                            </a>
                          );
                        },
                      },
                    ],
                    data: sanctions,
                  },
                })
                .addCell({
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8 w-full',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'person',
                        header: 'PEP (Politically Exposed Person)',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <div className={'flex space-x-2'}>
                              <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                              <span>{value}</span>
                            </div>
                          );
                        },
                      },
                      {
                        accessorKey: 'date',
                        header: 'Date',
                      },
                      {
                        accessorKey: 'source',
                        header: 'Source URL',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <a
                              className={buttonVariants({
                                variant: 'link',
                                className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                              })}
                              target={'_blank'}
                              rel={'noopener noreferrer'}
                              href={value}
                            >
                              Link
                            </a>
                          );
                        },
                      },
                    ],
                    data: pep,
                  },
                })
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
                        accessorKey: 'entry',
                        header: 'Adverse Media',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <div className={'flex space-x-2'}>
                              <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                              <span>{value}</span>
                            </div>
                          );
                        },
                      },
                      {
                        accessorKey: 'date',
                        header: 'Date',
                      },
                      {
                        accessorKey: 'source',
                        header: 'Source URL',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <a
                              className={buttonVariants({
                                variant: 'link',
                                className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                              })}
                              target={'_blank'}
                              rel={'noopener noreferrer'}
                              href={value}
                            >
                              Link
                            </a>
                          );
                        },
                      },
                    ],
                    data: adverseMedia,
                  },
                })
                .build()
                .flat(1),
            })
            .build()
            .flat(1),
        ) ?? []),
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
      value: 'Compliance Check Results',
    })
    .build()
    .concat(amlBlock)
    .flat(1);
};
