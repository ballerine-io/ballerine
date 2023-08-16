import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useCollectionFlowSchemaQuery = () => {
  const { isLoading, error, data } = useQuery(
    collectionFlowQuerykeys.getCollectionFlowSchema({
      workflowDefinitionId: import.meta.env.VITE_KYB_DEFINITION_ID,
    }),
  );

  return {
    isLoading,
    schema: data ? data : null,
    error: error as HTTPError,
  };
};
