import { fetchDocumentsByIds, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useEffect, useState } from 'react';
import { getDocumentIdsFromContext } from './helpers/get-document-ids-from-context';
import { mapDocumentRecordsToContextDocuments } from './helpers/map-document-records-to-context-documents';

export const useCollectionFlowContext = (context: CollectionFlowContext, uiSchema: UISchema) => {
  const [documentsState, setDocumentsState] = useState({ isLoading: false, documentIds: [] });
  const [finalContext, setFinalContext] = useState<CollectionFlowContext | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setDocumentsState({ isLoading: true, documentIds: [] });

        const documentIds = getDocumentIdsFromContext(context, uiSchema);

        if (!documentIds?.length) {
          setFinalContext(context);

          return;
        }

        const documents = await fetchDocumentsByIds(documentIds);
        const mappedContext = mapDocumentRecordsToContextDocuments(context, uiSchema, documents);

        setFinalContext(mappedContext);
      } catch (error) {
        setDocumentsState({ isLoading: false, documentIds: [] });
        setFinalContext(context);

        throw error;
      }
    };

    if (context && uiSchema && !documentsState.isLoading && !finalContext) {
      void run();
    }
  }, [context, uiSchema]);

  return finalContext;
};
