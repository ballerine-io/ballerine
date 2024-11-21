export const safeUrl = (url: string) => {
  try {
    return new URL(url);
  } catch {
    return;
  }
};
