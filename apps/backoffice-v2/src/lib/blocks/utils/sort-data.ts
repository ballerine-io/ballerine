import { SortDirection } from '@ballerine/common';

export const sortData = <TObj extends Record<PropertyKey, any>>({
  data,
  direction = 'asc',
  predefinedOrder = [],
  sortBy = 'title',
}: {
  direction?: SortDirection;
  predefinedOrder?: string[];
  data: TObj[];
  sortBy?: keyof TObj;
}) => {
  const orderedData = predefinedOrder.map(key => data.find(item => item[sortBy] === key));

  const restData = data
    .filter(item => !predefinedOrder.includes(item[sortBy]))
    .sort((a, b) =>
      direction === 'asc' ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy]),
    );

  return [...orderedData, ...restData].filter(Boolean);
};
