import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { AnyObject, ErrorsList, FileInputAdapter, RJSFInputProps } from '@ballerine/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import set from 'lodash/set';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';

interface DocumentFieldParams {
  documentData: AnyObject & { id: string };
  mappingParams: {
    documentIndex: number;
    documentPage: number;
  };
}

export const DocumentField = (
  props: RJSFInputProps & { definition: UIElement<DocumentFieldParams> },
) => {
  const { definition, ...restProps } = props;
  const { onChange } = restProps;
  const { stateApi } = useStateManagerContext();
  const { payload } = useStateManagerContext();
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
      const uploadResult = await uploadFile({ file });

      set(document, fileIdPath, uploadResult.id);
      set(document, 'decision', {});

      stateApi.setContext(context);

      collectionFlowFileStorage.registerFile(uploadResult.id, file);
      setFile(file);

      toggleElementLoading();
    },
    [stateApi, options, onChange, toggleElementLoading],
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
    </div>
  );
};
