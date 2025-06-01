import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';

export const useDocumentsQuery = () => {
  return useQuery({
    ...collectionFlowQuerykeys.getDocuments(),
    staleTime: Infinity,
  });
};
