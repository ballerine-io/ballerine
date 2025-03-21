import { DocumentPageImagesResult } from '@/lib/blocks/hooks/useDocumentPageImages';
import { generateDocumentTitle } from './generate-document-title';

import { TDocument } from '@ballerine/common';

export const getDocumentDetailsFromDocumentPage = ({
  document,
  documentIndex,
  documentPagesResults,
}: {
  document: TDocument;
  documentIndex: number;
  documentPagesResults: DocumentPageImagesResult;
}) => {
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
};
