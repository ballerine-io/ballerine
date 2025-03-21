import { TDocument } from '@ballerine/common';

export const getDocumentPagesBallerineFileIds = (documents: TDocument[]) => {
  return (
    documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }: { ballerineFileId: string }) => ballerineFileId),
    ) ?? []
  );
};
