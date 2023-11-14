import { useEventEmitterLogic } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { getDocumentFileIdPath } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/getDocumentFileIdPath';
import { FileUploaderField } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField';
import { useFileRepository } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { UploadFileFn } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { AnyObject, ErrorsList, RJSFInputProps } from '@ballerine/ui';
import { HTTPError } from 'ky';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

interface DocumentFieldParams {
  documentData: Partial<Document>;
}

export const DocumentField = (
  props: RJSFInputProps & { definition: UIElement<DocumentFieldParams> },
) => {
  const { definition, formData, onBlur, ...restProps } = props;
  const { stateApi } = useStateManagerContext();
  const { payload } = useStateManagerContext();
  const [fieldError, setFieldError] = useState<ErrorField | null>(null);
  const { options } = definition;

  const { toggleElementLoading } = useUIElementToolsLogic(definition.name);
  const { state: elementState } = useUIElementState(definition);

  const documentDefinition = useMemo(
    () => ({
      ...definition,
      valueDestination: `document-error-${definition.options.documentData.id}`,
    }),
    [definition],
  );

  const sendEvent = useEventEmitterLogic(definition);

  const { validationErrors, warnings } = useUIElementErrors(documentDefinition);
  const { isTouched } = elementState;

  const fileId = useMemo(() => {
    if (!Array.isArray(payload.documents)) return null;

    const document = payload.documents.find((document: Document) => {
      return document?.id === definition.options.documentData.id;
    }) as Document;

    const fileIdPath = getDocumentFileIdPath(definition);

    const fileId = get(document, fileIdPath) as string | null;

    return fileId;
  }, [payload.documents, definition]);
  useFileRepository(collectionFlowFileStorage, fileId);

  useLayoutEffect(() => {
    if (!fileId) return;

    const persistedFile = collectionFlowFileStorage.getFileById(fileId);

    if (persistedFile) return;

    void fetchFile(fileId).then(file => {
      const createdFile = new File([''], file.fileNameInBucket || file.fileNameOnDisk, {
        type: 'text/plain',
      });

      collectionFlowFileStorage.registerFile(fileId, createdFile);
    });
  }, [fileId, toggleElementLoading]);

  const fileUploader: UploadFileFn = useCallback(
    async (file: File) => {
      const context = stateApi.getContext();
      const document = (context.documents as Document[]).find(
        document => document && document.id === options.documentData.id,
      );

      try {
        toggleElementLoading();
        const uploadResult = await uploadFile({ file });
        setFieldError(null);

        return { fileId: uploadResult.id };
      } catch (error) {
        if (error instanceof HTTPError) {
          const response = (await error.response.json()) as AnyObject;
          setFieldError({
            fieldId: document.id,
            message: response.message as string,
            type: 'warning',
          });
          return;
        }

        throw error;
      } finally {
        toggleElementLoading();
      }
    },
    [stateApi, options, toggleElementLoading],
  );

  const handleChange = useCallback(
    (fileId: string) => {
      const context = stateApi.getContext();
      let document = (context.documents as Document[]).find(
        document => document && document.id === definition.options.documentData.id,
      );
      if (!document) {
        document = options.documentData as Document;
        context.documents = [...(context.documents as Document[]), document];
        set(context, 'documents', context.documents);
      }

      const fileIdPath = getDocumentFileIdPath(definition);

      set(document, fileIdPath, fileId);
      set(document, 'decision', {});

      stateApi.setContext(context);

      sendEvent('onChange');
    },
    [stateApi, options, definition, sendEvent],
  );

  return (
    <div className="flex flex-col gap-2">
      <FileUploaderField
        uploadFile={fileUploader}
        disabled={elementState.isLoading || restProps.disabled}
        fileId={fileId}
        fileRepository={collectionFlowFileStorage}
        onBlur={onBlur as () => void}
        onChange={handleChange}
      />
      {warnings.length ? <ErrorsList errors={warnings.map(err => err.message)} /> : null}
      {isTouched ? <ErrorsList errors={validationErrors.map(error => error.message)} /> : null}
      {fieldError ? <ErrorsList errors={[fieldError.message]} /> : null}
    </div>
  );
};
