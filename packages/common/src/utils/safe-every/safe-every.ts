export const safeEvery = <TItem>(
  array: TItem[] | readonly TItem[],
  predicate: (item: TItem) => boolean,
) => {
  if (!Array.isArray(array) || !array?.length) {
    return false;
  }

  return array.every(predicate);
};
