export const safeEntityIdFilter = <T>(list: Array<T>, filter: (item: T) => boolean) => {
  return list.filter(item => {
    const result = filter(item);
    const isMissing = !result;

    if (isMissing) {
      console.warn(
        `Missing entity id of entity: ${JSON.stringify(item)}. Entity id will be skipped.`,
      );
    }

    return result;
  });
};
