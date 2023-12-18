import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { toTitleCase } from 'string-ts';
import { isValidUrl } from '@/common/utils/is-valid-url';
import * as React from 'react';

export const useCompanySanctionsBlock = companySanctions => {
  if (!Array.isArray(companySanctions) || !companySanctions?.length) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Company Sanctions',
        },
        {
          type: 'container',
          value: [
            {
              type: 'subheading',
              value: 'Company check results',
              props: {
                className: 'text-lg my-4 block',
              },
            },
            {
              type: 'table',
              value: {
                columns: [
                  {
                    accessorKey: 'totalMatches',
                    header: 'Total matches',
                    cell: props => {
                      const value = props.getValue();

                      return (
                        <Badge
                          variant={'warning'}
                          className={`mb-1 rounded-lg px-2 py-1 font-bold`}
                        >
                          {value} {value === 1 ? 'match' : 'matches'}
                        </Badge>
                      );
                    },
                  },
                  {
                    accessorKey: 'fullReport',
                    header: 'Full report',
                  },
                ],
                data: [
                  {
                    totalMatches: companySanctions?.length,
                    fullReport: companySanctions,
                  },
                ],
              },
            },
          ],
        },
        ...companySanctions?.map((sanction, index) => ({
          type: 'container',
          props: {
            className: ctw({
              'mt-2': index === 0,
            }),
          },
          value: [
            {
              type: 'subheading',
              value: `Match ${index + 1}`,
              props: {
                className: 'text-lg block ms-2 mb-6',
              },
            },
            {
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
                    header: 'Primary name',
                  },
                  {
                    accessorKey: 'lastReviewed',
                    header: 'Last reviewed',
                  },
                ],
                data: [
                  {
                    primaryName: sanction?.primaryName,
                    lastReviewed: sanction?.lastReviewed,
                  },
                ],
              },
            },
            {
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
            },
            {
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
            },
            {
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
            },
            {
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
                    header: 'Alternative names',
                  },
                ],
                data: [
                  {
                    alternativeNames: sanction?.alternativeNames,
                  },
                ],
              },
            },
            {
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
                    header: 'Official lists',
                  },
                ],
                data: sanction?.officialLists?.map(({ description: officialList }) => ({
                  officialList,
                })),
              },
            },
            {
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
                    header: 'Further information',
                  },
                ],
                data: sanction?.furtherInformation?.map(furtherInformation => ({
                  furtherInformation,
                })),
              },
            },
            {
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
                    header: 'Linked individual',
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
            },
            {
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
                    header: 'Linked address',
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
            },
          ],
        })),
      ],
    },
  ];
};
