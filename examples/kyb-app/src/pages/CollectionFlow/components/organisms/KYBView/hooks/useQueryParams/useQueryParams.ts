import qs from 'qs';
import { useState } from 'react';

export function useQueryValues<TValues>(): TValues {
  const [queryValues] = useState(() => qs.parse(window.location.search.slice(1)) as TValues);

  return queryValues;
}
