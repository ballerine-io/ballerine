import { defaultSerializer } from './default-serializer';

export const mergeSearchParams = (
  oldSearchParams: URLSearchParams,
  searchParams: Record<string, string>,
) => {
  return new URLSearchParams(
    defaultSerializer({
      ...oldSearchParams,
      ...searchParams,
    }),
  );
};
