export const safeEvery = <TItem>(array: Array<TItem>, predicate: (item: TItem) => boolean) => {
  if (!Array.isArray(array) || !array?.length) return false;

  return array.every(predicate);
};
