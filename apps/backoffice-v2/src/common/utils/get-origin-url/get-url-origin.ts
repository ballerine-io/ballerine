export const getOriginUrl = (link: string) => {
  const url = new URL(link);

  return url.origin;
};
