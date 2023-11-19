import { z } from 'zod';

export interface SortingData {
  key: string;
  keyWithPrefix: string;
  value: 'asc' | 'desc';
}

export function getSortingDataFromQuery(string_: string, regex: RegExp) {
  const sortingQuerySchema = z
    .string()
    .regex(regex)
    .transform(sortingString => {
      regex.lastIndex = 0;
      const parseResult = regex.exec(sortingString);
      if (!parseResult) return null;
      const parseValues = [parseResult[1], parseResult[2], parseResult[3]];

      const [keyWithPrefix, key, value] = parseValues;

      return {
        keyWithPrefix,
        key,
        value: value as SortingData['value'],
      };
    })
    .catch(null);

  return sortingQuerySchema.parse(string_);
}
