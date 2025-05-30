import { useEffect, useMemo } from 'react';
import { useDocumentsService } from '../../../DocumentsService/hooks/internal/useDocumentsService';
import { IValidatorProviderProps, ValidatorProvider } from '../../../Validator/ValidatorProvider';
import { IValidatorWrapperContext } from './types';

export const ValidatorWrapper = <TValue extends object>({
  children,
  value,
  ...rest
}: IValidatorProviderProps<TValue>) => {
  const { documents, files } = useDocumentsService();

  const valueWithFilesAndDocuments = useMemo(() => {
    return {
      ...value,
      _documents: documents,
      _files: files.files,
    } as TValue & IValidatorWrapperContext;
  }, [value, documents, files.files]);

  useEffect(() => {
    // Manually injecting files in file storage so they can be used in validators context
    documents.forEach(document => {
      const documentFile = document.files?.[0];

      if (!documentFile) {
        files.removeFile({
          type: document.type,
          category: document.category,
          entityType: document.businessId ? 'business' : 'ubo',
          entityId: document.businessId ? document.businessId : document.endUserId!,
        });
      } else {
        const fileFromDocumentFile = new File([], documentFile.name, {
          type: documentFile.mimeType,
        });

        files.setFile(
          {
            type: document.type,
            category: document.category,
            entityType: document.businessId ? 'business' : 'ubo',
            entityId: document.businessId ? document.businessId : document.endUserId!,
          },
          fileFromDocumentFile,
        );
      }
    });
  }, [documents, files.setFile, files.removeFile]);

  return (
    <ValidatorProvider value={valueWithFilesAndDocuments} {...rest}>
      {children}
    </ValidatorProvider>
  );
};
