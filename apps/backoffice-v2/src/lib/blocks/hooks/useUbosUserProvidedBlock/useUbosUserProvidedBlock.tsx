import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { TextWithNAFallback } from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';

export const useUbosUserProvidedBlock = (
  ubosUserProvided: Array<{
    name: string;
    nationality: string;
    identityNumber: string;
    percentageOfOwnership: number;
    email: string;
    address: string;
  }>,
) => {
  const columnHelper = createColumnHelper<(typeof ubosUserProvided)[number]>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('nationality', {
      header: 'Nationality',
    }),
    columnHelper.accessor('identityNumber', {
      header: 'Identity number',
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
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('address', {
      header: 'Address',
    }),
  ];

  return useMemo(() => {
    if (Object.keys(ubosUserProvided ?? {}).length === 0) {
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
            value: 'UBOs',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell({
            type: 'table',
            value: {
              columns,
              data: ubosUserProvided,
            },
          })
          .build()
          .flat(1),
      })
      .build();
  }, [ubosUserProvided]);
};
