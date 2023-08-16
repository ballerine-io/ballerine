import { request } from '@app/common/utils/request';
import {
  CollectionFlowSchema,
  GetCollectionFlowSchemaDto,
} from '@app/domains/collection-flow/types';

interface FetchCollectionFlowResponse {
  definition?: {
    states?: {
      data_collection?: {
        metadata?: {
          uiSettings?: {
            multiForm?: {
              steps?: CollectionFlowSchema[];
            };
          };
        };
      };
    };
  };
}

export const fetchCollectionFlowSchema = async (
  query: GetCollectionFlowSchemaDto,
): Promise<CollectionFlowSchema[]> => {
  const result = await request
    .get(`external/workflows/workflow-definition/${query.workflowDefinitionId}`)
    .json<FetchCollectionFlowResponse>();

  return result.definition?.states?.data_collection?.metadata?.uiSettings?.multiForm?.steps || [];
};
