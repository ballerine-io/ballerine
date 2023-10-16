import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { AnyObject, FileInputAdapter, RJSVInputProps } from '@ballerine/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import set from 'lodash/set';
import get from 'lodash/get';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';

interface DocumentFieldParams {
  documentData: AnyObject;
  mappingParams: {
    documentIndex: number;
    documentPage: number;
  };
}

export const DocumentField = (
  props: RJSVInputProps & { definition: UIElement<DocumentFieldParams> },
) => {
  const { definition, ...restProps } = props;
  const { formData, onChange } = restProps;
  const { stateApi } = useStateManagerContext();
  const { options } = definition;
  const { documentIndex, documentPage } = options?.mappingParams || {};
  const [fileItem, setFile] = useState<File | null>(null);

  const { toggleElementLoading } = useUIElementToolsLogic(definition.name);
  //@ts-nocheck
  const documentPath = useMemo(
    () => `documents[${definition.options?.mappingParams?.documentIndex}]`,
    [definition],
  );
  const documentValue = useMemo(() => {
    const document = get(stateApi.getContext(), documentPath) as Document;

    return document ? document : null;
  }, [documentPath, definition]);

  useEffect(() => {
    debugger;
    if (documentValue) return;

    const documentFullPath = `documents[${definition.options?.mappingParams?.documentIndex}].pages[${definition.options?.mappingParams?.documentPage}]`;

    const ctx = stateApi.getContext();

    set(ctx, documentPath, definition.options.documentData);
    debugger;
    set(ctx, documentFullPath, {});

    stateApi.setContext(ctx);

    return () => {
      if (!documentValue) {
        set(ctx, documentPath, undefined);
      }
    };
  }, [documentValue]);

  useEffect(() => {
    if (!formData) return;

    const fileId = formData as string;
    debugger;
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
  }, [formData, toggleElementLoading]);

  const handleChange = useCallback(
    async (file: File) => {
      toggleElementLoading();

      const documentPath = `documents[${documentIndex}]`;

      const context = stateApi.getContext();
      const currentDocumentValue = get(context, documentPath) as Document;
      if (!currentDocumentValue) {
        set(context, documentPath, options.documentData);
      }

      const uploadResult = await uploadFile({ file });

      collectionFlowFileStorage.registerFile(uploadResult.id, file);
      setFile(file);

      onChange(uploadResult.id);

      toggleElementLoading();
    },
    [stateApi, documentIndex, options, onChange, toggleElementLoading],
  );

  if (documentIndex === undefined || documentPage === undefined) return null;

  console.log('context', stateApi.getContext());

  return <FileInputAdapter {...restProps} formData={fileItem} onChange={handleChange} />;
};
