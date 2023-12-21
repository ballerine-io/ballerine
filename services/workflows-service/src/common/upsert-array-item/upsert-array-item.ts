import { safeEvery } from '@ballerine/common';

/**
 * Update or insert item in array depending on if it already exists.
 * @param array - Array to update.
 * @param item - Item to insert or update.
 * @param findBy - Key to find item by.
 */
export const upsertArrayItem = <TItem>({
  array,
  item,
  findBy,
}: {
  array: TItem[];
  item: TItem;
  findBy: Array<keyof TItem>;
}) => {
  const isInExistence = array?.some(arrayItem =>
    safeEvery(findBy, key => arrayItem[key] === item[key]),
  );

  if (!isInExistence) {
    return [...array, item];
  }

  return array?.map(arrayItem =>
    safeEvery(findBy, key => arrayItem[key] !== item[key]) ? arrayItem : item,
  );
};
