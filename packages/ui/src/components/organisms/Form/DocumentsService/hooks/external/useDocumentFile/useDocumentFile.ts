import { useCallback, useEffect, useMemo } from 'react';
import { IDocumentWithFiles, TDocumentEntityType } from '../../../types';
import { useDocumentsService } from '../../internal/useDocumentsService';
import { useDocument } from '../useDocument';
import { useDocumentWithFile } from '../useDocumentWithFile';

interface IUseDocumentFileParams {
  type: string;
  category: string;
  entityType: TDocumentEntityType;
  entityId: string;
}

const createFileFromDocument = (document: IDocumentWithFiles) => {
  const firstDocumentFile = document.files[0];

  if (!firstDocumentFile) {
    console.warn('No file found for document', document);

    return;
  }

  const file = new File([], firstDocumentFile.name, { type: firstDocumentFile.mimeType });

  return file;
};

export const useDocumentFile = ({
  type,
  category,
  entityType,
  entityId,
}: IUseDocumentFileParams) => {
  const { isLoadingDocuments, files } = useDocumentsService();
  const document = useDocument({ type, category, entityType, entityId });
  const { documentWithFile, isLoading, isFetching } = useDocumentWithFile({ document });

  const documentFile = useMemo(() => {
    if (documentWithFile) {
      return createFileFromDocument(documentWithFile);
    }
  }, [documentWithFile]);

  const file = useMemo(() => {
    const fileInStorage = files.files[files.composeFileId({ type, category, entityId })];

    return documentFile || fileInStorage || null;
  }, [files, documentWithFile, type, category, entityId, documentFile]);

  useEffect(() => {
    if (documentFile) {
      files.removeFile({ type, category, entityId });
    }
  }, [files.removeFile]);

  const setFile = useCallback(
    (file: File) => {
      files.setFile(
        {
          type,
          category,
          entityId,
        },
        file,
      );
    },
    [files],
  );

  const removeFile = useCallback(() => {
    files.removeFile({
      type,
      category,
      entityId,
    });
  }, [files]);

  return {
    file,
    document,
    isLoading,
    isFetching,
    setFile,
    removeFile,
  };
};
