import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useSearchParams } from 'react-router-dom';

export const useWorkflowIdQuery = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const { data, isLoading, error, isFetched } = useQuery({
    ...collectionFlowQuerykeys.getWorkflowId(token),
    //@ts-ignore
    enabled: !!token,
  });

  return {
    workflowId: data ? data : null,
    isLoading,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
  };
};
