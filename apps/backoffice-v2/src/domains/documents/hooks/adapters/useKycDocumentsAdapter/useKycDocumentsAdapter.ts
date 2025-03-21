import { getDocumentDetailsFromDocumentPage } from '@/domains/documents/document-adapter-utils/get-document-details-from-document-page';
import { getDocumentPagesBallerineFileIds } from '@/domains/documents/document-adapter-utils/get-document-pages-ballerine-file-ids';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useDocumentPageImages } from '@/lib/blocks/hooks/useDocumentPageImages/useDocumentPageImages';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { extractCountryCodeFromDocuments } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { getDocumentsSchemas } from '@/pages/Entity/utils/get-documents-schemas/get-documents-schemas';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';

export const useKycDocumentsAdapter = ({
  documents: passedDocuments,
}: {
  documents: TDocument[];
}) => {
  const { data: workflow } = useCurrentCaseQuery();
  const { isDocumentsV2 } = workflow?.workflowDefinition?.config ?? {};
  const veriffDocuments = useMemo(
    // 'identification_document' is exclusive to Veriff
    () => passedDocuments?.filter(({ type }) => type === 'identification_document'),
    [passedDocuments],
  );
  const documentPages = useMemo(
    () => getDocumentPagesBallerineFileIds(veriffDocuments),
    [veriffDocuments],
  );

  const storageFilesQueryResult = useStorageFilesQuery(documentPages);
  const documentPagesResults = useDocumentPageImages(passedDocuments, storageFilesQueryResult);

  const identificationDocuments = useMemo(() => {
    if (isDocumentsV2) {
      return [
        ...(veriffDocuments?.map((document, documentIndex) => ({
          ...document,
          details: getDocumentDetailsFromDocumentPage({
            document,
            documentIndex,
            documentPagesResults,
          }),
        })) ?? []),
      ];
    }

    return passedDocuments?.map((document, documentIndex) => ({
      ...document,
      details: getDocumentDetailsFromDocumentPage({
        document,
        documentIndex,
        documentPagesResults,
      }),
    }));
  }, [passedDocuments, veriffDocuments, isDocumentsV2, documentPagesResults]);

  const issuerCountryCode = useMemo(
    () => extractCountryCodeFromDocuments(identificationDocuments ?? []),
    [identificationDocuments],
  );
  const documentsSchemas = useMemo(
    () => getDocumentsSchemas(issuerCountryCode, workflow),
    [issuerCountryCode, workflow],
  );

  const isSomeFilesLoading = useMemo(
    () => storageFilesQueryResult?.some(({ isLoading }) => isLoading),
    [storageFilesQueryResult],
  );

  return {
    documents: identificationDocuments,
    documentsSchemas,
    isLoading: isSomeFilesLoading,
  };
};
