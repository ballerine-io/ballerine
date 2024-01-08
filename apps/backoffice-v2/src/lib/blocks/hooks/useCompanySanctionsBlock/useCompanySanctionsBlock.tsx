import { Badge } from '@ballerine/ui';
import * as React from 'react';
import { ComponentProps, useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { toTitleCase } from 'string-ts';
import { isValidUrl } from '@/common/utils/is-valid-url';

export const useCompanySanctionsBlock = companySanctions => {
  return useMemo(() => {
    if (!Array.isArray(companySanctions)) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: [
          ...createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'heading',
              value: 'Company Sanctions',
            })
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'subheading',
                  value: 'Company check results',
                  props: {
                    className: 'text-lg my-4 block',
                  },
                })
                .addCell({
                  type: 'table',
                  value: {
                    columns: [
                      {
                        accessorKey: 'scanStatus',
                        header: 'Scan Status',
                        cell: props => {
                          const value = props.getValue();
                          const variant: ComponentProps<typeof Badge>['variant'] = 'success';

                          return (
                            <Badge
                              variant={variant}
                              className={`mb-1 rounded-lg px-2 py-1 font-bold`}
                            >
                              <>{value}</>
                            </Badge>
                          );
                        },
                      },
                      {
                        accessorKey: 'totalMatches',
                        header: 'Total Matches',
                        cell: props => {
                          const value = props.getValue();
                          const variant: ComponentProps<typeof Badge>['variant'] =
                            value === 0 ? 'success' : 'warning';

                          return (
                            <Badge
                              variant={variant}
                              className={`mb-1 rounded-lg px-2 py-1 font-bold`}
                            >
                              <>
                                {value} {value === 1 ? 'match' : 'matches'}
                              </>
                            </Badge>
                          );
                        },
                      },
                      {
                        accessorKey: 'fullReport',
                        header: 'Full Report',
                      },
                    ],
                    data: [
                      {
                        totalMatches: companySanctions?.length,
                        fullReport: companySanctions,
                        scanStatus: 'Completed',
                      },
                    ],
                  },
                })
                .build()
                .flat(1),
            })
            .build()
            .flat(1),
          ...companySanctions?.flatMap((sanction, index) =>
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
                      className: 'text-lg block ms-2 mb-6',
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'mb-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'primaryName',
                          header: 'Primary Name',
                        },
                        {
                          accessorKey: 'lastReviewed',
                          header: 'Last Reviewed',
                        },
                      ],
                      data: [
                        {
                          primaryName: sanction?.primaryName,
                          lastReviewed: sanction?.lastReviewed,
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
                          accessorKey: 'label',
                          header: 'Labels',
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
                      ],
                      data: sanction?.labels?.map(label => ({ label })),
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
                          accessorKey: 'reasonForMatch',
                          header: 'Reasons for Match',
                        },
                      ],
                      data: sanction?.reasonsForMatch?.map(reasonForMatch => ({
                        reasonForMatch: toTitleCase(reasonForMatch),
                      })),
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                        cell: {
                          className: 'break-all w-[60ch]',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'source',
                          header: 'Sources',
                        },
                      ],
                      data: sanction?.sources
                        ?.map(({ url: source }) => ({ source }))
                        // TODO: Research why zod's url validation fails on some valid urls.
                        ?.filter(({ source }) => isValidUrl(source)),
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
                          accessorKey: 'alternativeNames',
                          header: 'Alternative Names',
                        },
                      ],
                      data: [
                        {
                          alternativeNames: sanction?.alternativeNames,
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
                          accessorKey: 'officialList',
                          header: 'Official Lists',
                        },
                      ],
                      data: sanction?.officialLists?.map(({ description: officialList }) => ({
                        officialList,
                      })),
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
                          accessorKey: 'furtherInformation',
                          header: 'Further Information',
                        },
                      ],
                      data: sanction?.furtherInformation?.map(furtherInformation => ({
                        furtherInformation,
                      })),
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
                          accessorKey: 'linkedIndividual',
                          header: 'Linked Individual',
                        },
                        {
                          accessorKey: 'description',
                          header: 'Description',
                        },
                      ],
                      data: sanction?.linkedIndividuals?.map(
                        ({ firstName, middleName, lastName, description }) => ({
                          linkedIndividual: `${firstName}${
                            middleName ? `${middleName} ` : ''
                          } ${lastName}`,
                          description,
                        }),
                      ),
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
                          accessorKey: 'country',
                          header: 'Linked Address',
                        },
                        {
                          accessorKey: 'city',
                          header: 'City',
                        },
                        {
                          accessorKey: 'linkedAddress',
                          header: 'Address',
                        },
                      ],
                      data: sanction?.places?.map(({ country, city, address }) => ({
                        linkedAddress: address || 'N/A',
                        city: city || 'N/A',
                        country: country || 'N/A',
                      })),
                    },
                  })
                  .build()
                  .flat(1),
              })
              .build()
              .flat(1),
          ),
        ],
      })
      .build();
  }, [companySanctions]);
};
