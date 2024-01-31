export const sanitizeString = (string: string): string => {
  // removing emojis
  return string.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
};
