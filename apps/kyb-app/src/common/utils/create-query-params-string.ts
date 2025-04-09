export const createQueryParamsString = (
  params: Record<string, string | number | boolean | null>,
) => {
  const entries = Object.entries(params).filter(([, value]) => value !== null) as Array<
    [string, string | number | boolean]
  >;

  if (entries.length === 0) {
    return '';
  }

  return `?${entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')}`;
};
