import { generateDocumentTitle } from '@/domains/documents/document-adapter-utils/generate-document-title';
import { getDocumentDetailsFromDocumentPage } from '@/domains/documents/document-adapter-utils/get-document-details-from-document-page';
import { getDocumentPagesBallerineFileIds } from '@/domains/documents/document-adapter-utils/get-document-pages-ballerine-file-ids';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useDocumentPageImages } from '@/lib/blocks/hooks/useDocumentPageImages/useDocumentPageImages';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { extractCountryCodeFromDocuments } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { getDocumentsSchemas } from '@/pages/Entity/utils/get-documents-schemas/get-documents-schemas';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';
import { useDocumentsByEntityIdsAndWorkflowIdQuery } from '../../queries/useDocumentsByEntityIdsAndWorkflowIdQuery/useDocumentsByEntityIdsAndWorkflowIdQuery';

export const useWorkflowDocumentsAdapter = ({
  entityIds,
  documents: passedDocuments,
}: {
  entityIds: string[];
  documents: TDocument[];
}) => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: documentsV2, isLoading: isLoadingDocumentsV2 } =
    useDocumentsByEntityIdsAndWorkflowIdQuery({
      workflowId: workflow?.id ?? '',
      entityIds,
    });

  const { isDocumentsV2 } = workflow?.workflowDefinition?.config ?? {};
  const nonVeriffDocuments = useMemo(
    // 'identification_document' is exclusive to Veriff
    () => passedDocuments?.filter(({ type }) => type !== 'identification_document'),
    [passedDocuments],
  );
  const documentPages = useMemo(
    () => getDocumentPagesBallerineFileIds(nonVeriffDocuments),
    [nonVeriffDocuments],
  );

  const storageFilesQueryResult = useStorageFilesQuery(documentPages);
  const documentPagesResults = useDocumentPageImages(passedDocuments, storageFilesQueryResult);

  const documents = useMemo(() => {
    if (isDocumentsV2) {
      const documents =
        documentsV2?.map(({ decision, decisionReason, issuingCountry, ...document }) => ({
          ...document,
          decision: {
            status: decision === 'revisions' ? 'revision' : decision,
            reason: decisionReason,
          },
          issuer: {
            country: issuingCountry,
          },
          details:
            document?.files?.map(({ mimeType, fileName, variant, fileId, imageUrl }) => {
              const title = generateDocumentTitle({
                category: document?.category ?? '',
                type: document?.type ?? '',
                variant,
              });

              return {
                id: fileId,
                title,
                fileType: mimeType,
                fileName,
                imageUrl,
              };
            }) ?? [],
        })) ?? [];

      return documents;
    }

    return nonVeriffDocuments?.map((document, documentIndex) => ({
      ...document,
      details: getDocumentDetailsFromDocumentPage({
        document,
        documentIndex,
        documentPagesResults,
      }),
    }));
  }, [documentsV2, nonVeriffDocuments, documentPagesResults, isDocumentsV2]);

  const issuerCountryCode = extractCountryCodeFromDocuments(documents ?? []);
  const documentsSchemas = getDocumentsSchemas(issuerCountryCode, workflow);
  const isSomeFilesLoading = useMemo(
    () => storageFilesQueryResult?.some(({ isLoading }) => isLoading),
    [storageFilesQueryResult],
  );

  return {
    documents,
    documentsSchemas,
    isLoading: isLoadingDocumentsV2 || isSomeFilesLoading,
  };
};
