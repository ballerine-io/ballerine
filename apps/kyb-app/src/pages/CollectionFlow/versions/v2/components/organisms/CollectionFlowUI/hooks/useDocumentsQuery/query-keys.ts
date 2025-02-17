import { createQueryKeys } from '@lukemorales/query-key-factory';
import { request } from '@/common/utils/request';

const fetchDocuments = async ({
  entityId,
  workflowRuntimeDataId,
}: {
  entityId: string;
  workflowRuntimeDataId: string;
}) => {
  return await request.get(`collection-flow/documents/${entityId}/${workflowRuntimeDataId}`).json();
};

export const useDocumentsQueryKeys = createQueryKeys('documents', {
  getDocuments: ({
    entityId,
    workflowRuntimeDataId,
  }: {
    entityId: string;
    workflowRuntimeDataId: string;
  }) => ({
    queryKey: [
      {
        entityId,
        workflowRuntimeDataId,
      },
    ],
    queryFn: () =>
      fetchDocuments({
        entityId,
        workflowRuntimeDataId,
      }),
  }),
});
