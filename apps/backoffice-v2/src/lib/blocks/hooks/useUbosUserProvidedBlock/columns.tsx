import { createColumnHelper } from '@tanstack/react-table';
import { IUBOSUserProvided } from './types';
import { TextWithNAFallback } from '@ballerine/ui';

const columnHelper = createColumnHelper<IUBOSUserProvided>();

export const ubosUserProvidedColumns = [
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

      return <TextWithNAFallback>{value || value === 0 ? `${value}%` : value}</TextWithNAFallback>;
    },
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('address', {
    header: 'Address',
  }),
];
