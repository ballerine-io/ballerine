import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { useState } from 'react';
import { useQueryParams, NumberParam, withDefault, ArrayParam } from 'use-query-params';
import * as dayjs from 'dayjs';

export function useWorkflowsQueryParams() {
  const [dateNow] = useState(() => dayjs().subtract(1, 'hour').toDate());

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 25),
    status: withDefault(ArrayParam, [] as IWorkflowStatus[]),
    fromDate: withDefault(NumberParam, +dateNow),
  });

  return {
    query,
    setQuery,
  };
}
