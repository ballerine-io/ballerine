import { BooleanParam, NumberParam, useQueryParams, withDefault } from 'use-query-params';

export function useWorkflowsDefinitionQueryParams() {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 20),
    public: withDefault(BooleanParam, true),
  });

  return {
    query,
    setQuery,
  };
}
