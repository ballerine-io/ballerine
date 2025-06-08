import { useMemo } from 'react';
import { useDocumentsQuery } from './domains/documents/queries/useDocumentsQuery';
import { DocumentsServiceContext } from './context/DocumentsServiceContext';
import { useFiles } from './hooks/internal/useFiles';

interface IDocumentServiceProps {
  children: React.ReactNode;
}

export const DocumentsService = ({ children }: IDocumentServiceProps) => {
  const { files, setFile, removeFile, composeFileId } = useFiles();
  const { data: documents, isFetching: isFetchingDocuments } = useDocumentsQuery(false);

  const context = useMemo(
    () => ({
      documents: documents ?? [],
      isLoadingDocuments: isFetchingDocuments,
      files: {
        files,
        setFile,
        removeFile,
        composeFileId,
      },
    }),
    [documents, isFetchingDocuments, files, setFile, removeFile, composeFileId],
  );

  return (
    <DocumentsServiceContext.Provider value={context}>{children}</DocumentsServiceContext.Provider>
  );
};
