import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { extractCountryCodeFromDocuments } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useDocumentsQuery } from '../queries/useDocumentsQuery/useDocumentsQuery';
import { getDocumentsSchemas } from '@/pages/Entity/utils/get-documents-schemas/get-documents-schemas';
import { titleCase } from 'string-ts';
import { TDocument, valueOrNA } from '@ballerine/common';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useDocumentPageImages } from '@/lib/blocks/hooks/useDocumentPageImages/useDocumentPageImages';

export const useDocumentsAdapter = ({
  entityId,
  documents: passedDocuments,
}: {
  entityId: string;
  documents: TDocument[];
}) => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: documentsV2, isLoading: isLoadingDocumentsV2 } = useDocumentsQuery({
    workflowId: workflow?.id ?? '',
    entityId,
  });
  const { isDocumentsV2 } = workflow?.workflowDefinition?.config ?? {};
  const generateDocumentTitle = useCallback(
    ({ category, type, variant }: { category: string; type: string; variant: string }) => {
      return [valueOrNA(titleCase(category ?? '')), valueOrNA(titleCase(type ?? '')), variant].join(
        ' - ',
      );
    },
    [],
  );
  const identificationDocuments = useMemo(
    // 'identification_document' is exclusive to Veriff
    () => passedDocuments?.filter(({ type }) => type === 'identification_document'),
    [passedDocuments],
  );
  const getDocumentPagesBallerineFileIds = useCallback((documents: TDocument[]) => {
    return (
      documents?.flatMap(({ pages }) => pages?.map(({ ballerineFileId }) => ballerineFileId)) ?? []
    );
  }, []);
  const documentPages = useMemo(() => {
    if (isDocumentsV2) {
      return getDocumentPagesBallerineFileIds(identificationDocuments);
    }

    return getDocumentPagesBallerineFileIds(passedDocuments);
  }, [passedDocuments, isDocumentsV2]);
  const storageFilesQueryResult = useStorageFilesQuery(documentPages);
  const documentPagesResults = useDocumentPageImages(passedDocuments, storageFilesQueryResult);
  const documentPagesToDetailsAdapter = useCallback(
    ({ document, documentIndex }: { document: TDocument; documentIndex: number }) => {
      return (
        document?.pages?.map(({ type, fileName, metadata, ballerineFileId }, pageIndex) => {
          const title = generateDocumentTitle({
            category: document?.category ?? '',
            type: document?.type ?? '',
            variant: metadata?.side,
          });

          return {
            id: ballerineFileId,
            title,
            fileType: type,
            fileName,
            imageUrl: documentPagesResults?.[documentIndex]?.[pageIndex],
          };
        }) ?? []
      );
    },
    [documentPagesResults, generateDocumentTitle],
  );
  const getDocuments = () => {
    if (isDocumentsV2) {
      const adaptedDocumentsV2 =
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

      return [
        ...adaptedDocumentsV2,
        ...(identificationDocuments?.map((document, documentIndex) => ({
          ...document,
          details: documentPagesToDetailsAdapter({
            document,
            documentIndex,
          }),
        })) ?? []),
      ];
    }

    return passedDocuments?.map((document, documentIndex) => ({
      ...document,
      details: documentPagesToDetailsAdapter({
        document,
        documentIndex,
      }),
    }));
  };

  const documents = getDocuments();

  const issuerCountryCode = extractCountryCodeFromDocuments(documents ?? []);
  const documentsSchemas = getDocumentsSchemas(issuerCountryCode, workflow);

  return {
    documents,
    documentsSchemas,
    isLoading: isLoadingDocumentsV2 || storageFilesQueryResult?.some(({ isLoading }) => isLoading),
  };
};
