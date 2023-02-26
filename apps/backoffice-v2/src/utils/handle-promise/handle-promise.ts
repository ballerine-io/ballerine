export const handlePromise = async <TData>(
  promise: Promise<TData>,
): Promise<[TData, undefined] | [undefined, Error]> => {
  try {
    const data = await promise;

    return [data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};
