export interface SortingData {
  key: string;
  keyWithPrefix: string;
  value: 'asc' | 'desc';
}

export function getSortingDataFromQuery(string: string, regex: RegExp): SortingData | null {
  const parseResult = regex.exec(string);

  if (!parseResult) return null;

  const parseValues = [parseResult[1], parseResult[2], parseResult[3]];

  if (!parseResult.length || !parseValues.every(val => Boolean(val))) return null;

  const [keyWithPrefix, key, value] = parseValues;

  return {
    keyWithPrefix,
    key,
    value: value as SortingData['value'],
  };
}
