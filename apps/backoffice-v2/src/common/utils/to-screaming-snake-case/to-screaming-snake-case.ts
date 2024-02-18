import { isString } from '@/common/utils/is-string/is-string';
import { snakeCase, toUpperCase } from 'string-ts';

export const toScreamingSnakeCase = <TString extends string>(string_: TString) => {
  if (!isString(string_)) return string_;

  return toUpperCase(snakeCase(string_));
};
