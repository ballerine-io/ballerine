import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEndUserQuery } from '../useEndUserQuery';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';

export const useCustomerQuery = () => {
  const workflowId = useWorkflowId();
  const { data: endUser } = useEndUserQuery();

  const { data, isLoading, error, isFetched } = useQuery({
    ...collectionFlowQuerykeys.getCustomer(endUser?.id ?? null),
    //@ts-ignore
    enabled: !!workflowId,
  });

  return {
    customer: data ? data : null,
    isLoading,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
  };
};
