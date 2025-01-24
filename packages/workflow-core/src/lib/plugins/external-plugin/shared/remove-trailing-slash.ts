export const removeTrailingSlash = (url: string) => {
  return url.replace(/\/$/, '');
};
