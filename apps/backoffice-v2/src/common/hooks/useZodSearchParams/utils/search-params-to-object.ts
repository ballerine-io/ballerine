export const searchParamsToObject = (searchParams: URLSearchParams) =>
  Object.fromEntries(searchParams.entries());
