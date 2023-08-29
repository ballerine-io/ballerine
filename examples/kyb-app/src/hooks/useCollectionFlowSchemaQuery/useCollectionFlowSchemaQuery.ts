import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useMemo } from 'react';

export const useCollectionFlowSchemaQuery = () => {
  const { isLoading, error, data } = useQuery({
    ...collectionFlowQuerykeys.getCollectionFlowSchema(),
    staleTime: Infinity,
  });

  const steps = useMemo(() => (data ? data.steps : []), [data]);
  const documentConfigurations = useMemo(() => (data ? data.documentConfigurations : []), [data]);

  return {
    isLoading,
    steps,
    documentConfigurations,
    error: error as HTTPError,
  };
};
