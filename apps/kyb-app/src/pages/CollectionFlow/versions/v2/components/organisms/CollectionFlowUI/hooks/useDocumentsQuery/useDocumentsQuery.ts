import { useQuery } from '@tanstack/react-query';
import { useDocumentsQueryKeys } from './query-keys';
import { useAccessToken } from '@/common/providers/AccessTokenProvider';

export const useDocumentsQuery = ({
  entityId,
  workflowRuntimeDataId,
}: {
  entityId: string;
  workflowRuntimeDataId: string;
}) => {
  const { accessToken } = useAccessToken();

  return useQuery({
    ...useDocumentsQueryKeys.getDocuments({ entityId, workflowRuntimeDataId }),
    //@ts-ignore
    enabled: !!accessToken,
  });
};
