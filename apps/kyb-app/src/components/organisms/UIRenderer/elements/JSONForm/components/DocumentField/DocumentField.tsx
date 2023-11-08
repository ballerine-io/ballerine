import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { getDocumentFileIdPath } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/getDocumentFileIdPath';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { AnyObject, ErrorsList, FileInputAdapter, RJSFInputProps } from '@ballerine/ui';
import { HTTPError } from 'ky';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface DocumentFieldParams {
  documentData: Partial<Document>;
}

export const DocumentField = (
  props: RJSFInputProps & { definition: UIElement<DocumentFieldParams> },
) => {
  const { definition, onChange, ...restProps } = props;
  const { stateApi } = useStateManagerContext();
  const { payload } = useStateManagerContext();
  const [fieldError, setFieldError] = useState<ErrorField | null>(null);
  const { options } = definition;
  const [fileItem, setFile] = useState<File | null>(null);

  const { toggleElementLoading } = useUIElementToolsLogic(definition.name);
  const { state: elementState } = useUIElementState(definition);

  const documentDefinition = useMemo(
    () => ({
      ...definition,
      valueDestination: `document-error-${definition.options.documentData.id}`,
    }),
    [definition],
  );
  const { validationErrors, warnings } = useUIElementErrors(documentDefinition);
  const { isTouched } = elementState;

  const fileId = useMemo(() => {
    if (!Array.isArray(payload.documents)) return null;

    const document = payload.documents.find((document: Document) => {
      return document.id === definition.options.documentData.id;
    }) as Document;

    const fileIdPath = getDocumentFileIdPath(definition);

    const fileId = get(document, fileIdPath) as string | null;

    return fileId;
  }, [payload.documents, definition]);

  useEffect(() => {
    if (!fileId) return;

    const persistedFile = collectionFlowFileStorage.getFileById(fileId);

    if (persistedFile) {
      setFile(persistedFile);
    } else {
      void fetchFile(fileId).then(file => {
        const createdFile = new File([''], file.fileNameInBucket || file.fileNameOnDisk, {
          type: 'text/plain',
        });

        collectionFlowFileStorage.registerFile(fileId, createdFile);
        setFile(createdFile);
      });
    }
  }, [fileId, toggleElementLoading]);

  const handleChange = useCallback(
    async (file: File) => {
      toggleElementLoading();

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

      try {
        const uploadResult = await uploadFile({ file });

        set(document, fileIdPath, uploadResult.id);
        // set(document, fileTypePath, file.type);
        set(document, 'decision', {});

        stateApi.setContext(context);

        collectionFlowFileStorage.registerFile(uploadResult.id, file);
        setFile(file);
        setFieldError(null);
        onChange(uploadResult.id);
      } catch (err) {
        if (err instanceof HTTPError) {
          const response = (await err.response.json()) as AnyObject;
          setFieldError({
            fieldId: document.id,
            message: response.message as string,
            type: 'warning',
          });
          return;
        }

        throw err;
      } finally {
        toggleElementLoading();
      }
    },
    [stateApi, options, definition, toggleElementLoading],
  );

  return (
    <div className="flex flex-col gap-2">
      <FileInputAdapter
        {...restProps}
        disabled={elementState.isLoading || restProps.disabled}
        formData={fileItem}
        onChange={handleChange}
      />
      {warnings.length ? <ErrorsList errors={warnings.map(err => err.message)} /> : null}
      {isTouched ? <ErrorsList errors={validationErrors.map(error => error.message)} /> : null}
      {fieldError ? <ErrorsList errors={[fieldError.message]} /> : null}
    </div>
  );
};
