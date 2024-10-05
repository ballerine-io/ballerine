import { SortDirection } from '@ballerine/common';
import { ExtractCellProps } from '@ballerine/blocks';

export const sortData = ({
  data,
  direction = 'asc',
  predefinedOrder = [],
}: {
  direction?: SortDirection;
  predefinedOrder?: string[];
  data: ExtractCellProps<'details'>['value']['data'];
}) => {
  const orderedData = predefinedOrder.map(key => data.find(value => value.title === key));

  const restData = data
    .filter(data => !predefinedOrder.includes(data.title))
    .sort((a, b) =>
      direction === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
    );

  return [...orderedData, ...restData].filter(Boolean);
};
