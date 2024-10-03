import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { FileUploaderField } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField';
import { useFileRepository } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { useValidator } from '@/components/providers/Validator/hooks/useValidator';
import { Document } from '@/domains/collection-flow';
import { fetchFile } from '@/domains/storage/storage.api';
import { collectionFlowFileStorage } from '@/pages/CollectionFlow/collection-flow.file-storage';
import { FieldErrors } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldErrors';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { useDocument } from '@/pages/CollectionFlowV2/components/ui/fields/DocumentField/hooks/useDocument';
import { useDocumentUpload } from '@/pages/CollectionFlowV2/components/ui/fields/DocumentField/hooks/useDocumentUpload';
import { useDocuments } from '@/pages/CollectionFlowV2/components/ui/fields/DocumentField/hooks/useDocuments';
import { useEventEmmitter } from '@/pages/CollectionFlowV2/hocs/withConnectedField';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { ErrorsList } from '@ballerine/ui';
import { FunctionComponent, useCallback, useLayoutEffect } from 'react';

export type TDocumentFieldValueType = string | undefined;
export interface IDocumentFieldParams {
  initialData: Partial<Document>;
  pageIndex?: number;
}

export const DocumentField: FunctionComponent<
  IFieldComponentProps<TDocumentFieldValueType, IDocumentFieldParams>
> = ({ definition, stack, options, fieldProps }) => {
  const { payload } = useStateManagerContext();
  const uiElement = useUIElement(definition, payload, stack);
  console.log('doc id', uiElement.getId());
  const documents = useDocuments(uiElement);
  const { fileId, setDocument, clearDocument } = useDocument({
    documents,
    params: options,
    uiElement,
  });
  const { fileUploader, isUploading, uploadError } = useDocumentUpload();
  const { validate } = useValidator();

  const emitEvent = useEventEmmitter(uiElement);

  const { onBlur, disabled } = fieldProps;
  useFileRepository(collectionFlowFileStorage, fileId);

  useLayoutEffect(() => {
    if (!fileId) return;

    const persistedFile = collectionFlowFileStorage.getFileById(fileId);

    if (persistedFile) return;

    void fetchFile(fileId).then(file => {
      const createdFile = new File([''], file.fileNameInBucket || file.fileNameOnDisk || '', {
        type: 'text/plain',
      });

      collectionFlowFileStorage.registerFile(fileId, createdFile);
    });
  }, [fileId]);

  const handleChange = useCallback(
    (fileId: string) => {
      setDocument(fileId);
      emitEvent('onChange');
      validate();
    },
    [setDocument, emitEvent, validate],
  );

  return (
    <FieldLayout definition={definition}>
      <FileUploaderField
        uploadFile={fileUploader}
        disabled={
          // (state.isRevision && warnings.length ? false : elementState.isLoading || restProps.disabled)
          isUploading || disabled
        }
        fileId={fileId}
        fileRepository={collectionFlowFileStorage}
        onBlur={onBlur as () => void}
        testId={uiElement.getId()}
        onChange={handleChange}
      />
      {/* {!!warnings.length && <ErrorsList errors={warnings.map(err => err.message)} />}
      {isTouched && !!validationErrors.length && (
        <ErrorsList errors={validationErrors.map(error => error.message)} />
      )} */}
      {uploadError && <ErrorsList errors={[uploadError.message]} />}
      <FieldErrors definition={definition} />
    </FieldLayout>
  );
};
