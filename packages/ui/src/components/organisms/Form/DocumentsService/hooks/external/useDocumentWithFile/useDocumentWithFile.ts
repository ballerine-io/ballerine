import { useDocumentWithFilesQuery } from '../../../domains/documents/queries/useDocumentWithFilesQuery';
import { IDocument } from '../../../types';

interface IUseDocumentWithFile {
  document: IDocument | undefined;
}

export const useDocumentWithFile = ({ document }: IUseDocumentWithFile) => {
  const { data: documentWithFile, isLoading, isFetching } = useDocumentWithFilesQuery(document?.id);

  return {
    documentWithFile: documentWithFile ?? null,
    isLoading,
    isFetching,
  };
};
