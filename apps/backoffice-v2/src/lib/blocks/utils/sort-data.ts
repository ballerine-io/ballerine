import { SortDirection } from '@ballerine/common';

export const sortData = <TObj extends { title: string }>({
  data,
  direction = 'asc',
  predefinedOrder = [],
}: {
  direction?: SortDirection;
  predefinedOrder?: string[];
  data: TObj[];
}) => {
  const orderedData = predefinedOrder.map(key => data.find(item => item.title === key));

  const restData = data
    .filter(item => !predefinedOrder.includes(item.title))
    .sort((a, b) =>
      direction === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
    );

  return [...orderedData, ...restData].filter(Boolean);
};
