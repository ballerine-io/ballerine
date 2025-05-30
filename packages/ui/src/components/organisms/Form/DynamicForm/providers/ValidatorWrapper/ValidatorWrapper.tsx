import { useMemo } from 'react';
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
      _files: documents.reduce((acc, document) => {
        const fileId = files.composeFileId({
          type: document.type,
          category: document.category,
          entityType: document.businessId ? 'business' : 'ubo',
          entityId: document.businessId ? document.businessId : document.endUserId!,
        });

        if (!document.files?.[0]) {
          return acc;
        }

        return {
          ...acc,
          [fileId]: new File([], document.files?.[0]?.name!, {
            type: document.files?.[0]?.mimeType,
          }),
        };
      }, files.files),
    } as TValue & IValidatorWrapperContext;
  }, [value, documents, files.files]);

  console.log('valueWithFilesAndDocuments', valueWithFilesAndDocuments);

  return (
    <ValidatorProvider value={valueWithFilesAndDocuments} {...rest}>
      {children}
    </ValidatorProvider>
  );
};
