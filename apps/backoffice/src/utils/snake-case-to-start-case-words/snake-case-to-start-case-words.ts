import { snakeCaseToWords } from '../snake-case-to-words/snake-case-to-words';
import { toStartCase } from '../to-start-case/to-start-case';

// Turns a string of 'snake_case' into 'Snake case'.
export const snakeCaseToStartCaseWords = (str: string) => {
  if (typeof str !== 'string') return str;

  return toStartCase(snakeCaseToWords(str));
};
