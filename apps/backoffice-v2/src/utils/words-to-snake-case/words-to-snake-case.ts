// Turns a string of 'Two words' into 'two_words'.
export const wordsToSnakeCase = (str: string) => {
  if (typeof str !== 'string') return str;

  return str?.replace(' ', '_').toLowerCase();
};
