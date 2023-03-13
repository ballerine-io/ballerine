export const handlePromise = async <TResult>(
  promise: Promise<TResult>,
): Promise<[TResult, undefined] | [undefined, unknown]> => {
  try {
    const res = await promise;

    return [res, undefined];
  } catch (err) {
    return [undefined, err];
  }
};
