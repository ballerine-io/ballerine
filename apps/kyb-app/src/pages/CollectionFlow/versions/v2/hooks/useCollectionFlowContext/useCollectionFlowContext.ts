import { fetchDocumentsByIds, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useEffect, useState } from 'react';
import { assignDocumentStatusesAndDecisionToDocumentsInContext } from './helpers/assign-document-statuses-and-decision-to-documents-in-context';
import { getDocumentIdsFromContext } from './helpers/get-document-ids-from-context';

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

        setFinalContext(
          assignDocumentStatusesAndDecisionToDocumentsInContext(context, uiSchema, documents),
        );
      } catch (error) {
        setDocumentsState({ isLoading: false, documentIds: [] });
        setFinalContext(context);
      }
    };

    if (context && uiSchema && !documentsState.isLoading && !finalContext) {
      void run();
    }
  }, [context, uiSchema]);

  return finalContext;
};
