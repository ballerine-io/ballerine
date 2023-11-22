import { useEventEmitterLogic } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { DocumentValueDestinationParser } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/document-value-destination-parser';
import { serializeDocumentId } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/serialize-document-id';
import { FileUploaderField } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField';
import { useFileRepository } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileRepository';
import { UploadFileFn } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { findDocumentSchemaByTypeAndCategory } from '@ballerine/common';
import { AnyObject, ErrorsList, RJSFInputProps } from '@ballerine/ui';
import { HTTPError } from 'ky';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

export interface DocumentFieldParams {
  documentData: Partial<Document>;
}

export const DocumentField = (
  props: RJSFInputProps & { definition: UIElement<DocumentFieldParams> } & {
    inputIndex: number | null;
  },
) => {
  const { state } = useDynamicUIContext();
  const { definition, formData, inputIndex, onBlur, ...restProps } = props;
  const { stateApi } = useStateManagerContext();
  const { payload } = useStateManagerContext();
  const [fieldError, setFieldError] = useState<ErrorField | null>(null);
  const { options } = definition;

  const { toggleElementLoading } = useUIElementToolsLogic(definition.name);
  const { state: elementState } = useUIElementState(definition);

  const documentDefinition = useMemo(
    () => ({
      ...definition,
      valueDestination: `document-error-${serializeDocumentId(
        definition.options.documentData.id,
        inputIndex,
      )}`,
    }),
    [definition, inputIndex],
  );

  const sendEvent = useEventEmitterLogic(definition);

  const getErrorKey = useCallback(() => documentDefinition.valueDestination, [documentDefinition]);
  const { validationErrors, warnings } = useUIElementErrors(documentDefinition, getErrorKey);
  const { isTouched } = elementState;

  const fileId = useMemo(() => {
    if (!Array.isArray(payload.documents)) return null;

    const parser = new DocumentValueDestinationParser(definition.valueDestination);
    const documentsPath = parser.extractRootPath();
    const documentPagePath = parser.extractPagePath();
    const documents = (get(payload, documentsPath) as Document[]) || [];

    const document = documents.find((document: Document) => {
      return document?.id === serializeDocumentId(definition.options.documentData.id, inputIndex);
    });

    const documentPage = get(document, documentPagePath) as Document['pages'][number];
    const fileIdPath = parser.extractFileIdPath();

    const fileId = get(documentPage, fileIdPath) as string | null;

    return fileId;
  }, [payload, definition, inputIndex]);
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
      const parser = new DocumentValueDestinationParser(definition.valueDestination);

      const context = stateApi.getContext();
      const documents = (get(context, parser.extractRootPath()) as Document[]) || [];
      const document = documents.find(
        document =>
          document && document.id === serializeDocumentId(options.documentData.id, inputIndex),
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
    [stateApi, options, inputIndex, definition.valueDestination, toggleElementLoading],
  );

  const handleChange = useCallback(
    (fileId: string) => {
      const destinationParser = new DocumentValueDestinationParser(definition.valueDestination);
      const pathToDocumentsList = destinationParser.extractRootPath();
      const pathToPage = destinationParser.extractPagePath();
      const pathToFileId = destinationParser.extractFileIdPath();

      const context = stateApi.getContext();
      const documents = (get(context, pathToDocumentsList) as Document[]) || [];

      let document = documents.find(
        document =>
          document &&
          document.id === serializeDocumentId(definition.options.documentData.id, inputIndex),
      );

      if (!document) {
        document = {
          ...options.documentData,
          id: serializeDocumentId(options.documentData.id, inputIndex),
          propertiesSchema:
            findDocumentSchemaByTypeAndCategory(
              options.documentData.type,
              options.documentData.category,
            )?.propertiesSchema || undefined,
        } as Document;
        documents.push(document);
        set(context, pathToDocumentsList, documents);
      }

      const documentPage =
        (get(document, pathToPage) as Document['pages'][number]) ||
        ({} as Document['pages'][number]);

      set(documentPage, pathToFileId, fileId);
      set(document, pathToPage, documentPage);
      set(document, 'decision', {});

      stateApi.setContext(context);

      sendEvent('onChange');
    },
    [stateApi, options, definition, inputIndex, sendEvent],
  );

  return (
    <div className="flex flex-col gap-2">
      <FileUploaderField
        uploadFile={fileUploader}
        disabled={
          state.isRevision && warnings.length ? false : elementState.isLoading || restProps.disabled
        }
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
