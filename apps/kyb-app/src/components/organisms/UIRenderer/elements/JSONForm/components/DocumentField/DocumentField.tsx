import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { AnyObject, ErrorsList, FileInputAdapter, RJSVInputProps } from '@ballerine/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import set from 'lodash/set';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { HTTPError } from 'ky';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';

interface DocumentFieldParams {
  documentData: AnyObject & { id: string };
  mappingParams: {
    documentIndex: number;
    documentPage: number;
  };
}

export const DocumentField = (
  props: RJSVInputProps & { definition: UIElement<DocumentFieldParams> },
) => {
  const { definition, ...restProps } = props;
  const { onChange } = restProps;
  const { stateApi } = useStateManagerContext();
  const { payload } = useStateManagerContext();
  const [fieldError, setFieldError] = useState<ErrorField | null>(null);
  const { options } = definition;
  const [fileItem, setFile] = useState<File | null>(null);

  const { toggleElementLoading } = useUIElementToolsLogic(definition.name);
  const { state: elementState } = useUIElementState(definition);
  const valueDestination = `document-error-${definition.options.documentData.id}`;

  const documentDefinition = useMemo(
    () => ({
      ...definition,
      valueDestination,
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

    const fileId =
      document && document.pages?.length
        ? document.pages[definition.options.mappingParams.documentPage]?.ballerineFileId
        : null;

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

      const fileIdPath = definition.valueDestination.replace(/documents\[\d+\]\./g, '');

      try {
        const uploadResult = await uploadFile({ file });

        set(document, fileIdPath, uploadResult.id);
        set(document, 'decision', {});

        stateApi.setContext(context);

        collectionFlowFileStorage.registerFile(uploadResult.id, file);
        setFile(file);
        setFieldError(null);
      } catch (err) {
        if (err instanceof HTTPError) {
          const jsonError = await err.response.json();

          setFieldError({
            fieldId: document.id,
            message: jsonError.message,
            type: 'warning',
          });
        }
      }

      toggleElementLoading();
    },
    [stateApi, options, onChange, toggleElementLoading],
  );

  const filedErrors = fieldError ? [fieldError] : [];
  return (
    <div className="flex flex-col gap-2">
      <FileInputAdapter
        {...restProps}
        disabled={elementState.isLoading || restProps.disabled}
        formData={fileItem}
        onChange={handleChange}
      />
      {warnings.length ? (
        <ErrorsList errors={[...warnings, ...filedErrors].map(err => err.message)} />
      ) : null}
      {isTouched ? <ErrorsList errors={validationErrors.map(error => error.message)} /> : null}
      {fieldError ? <ErrorsList errors={[fieldError.message]} /> : null}
    </div>
  );
};
