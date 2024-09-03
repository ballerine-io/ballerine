import { FunctionComponent } from 'react';
import { ExtractCellProps } from '@ballerine/blocks';
import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';

export const DataTableCell: FunctionComponent<ExtractCellProps<'dataTable'>> = ({ value }) => (
  <UrlDataTable {...value} />
);
