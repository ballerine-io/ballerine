import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { Document, UIElement } from '@app/domains/collection-flow';
import { fetchFile, uploadFile } from '@app/domains/storage/storage.api';
import { AnyObject, FileInputAdapter, RJSVInputProps } from '@ballerine/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import set from 'lodash/set';
import get from 'lodash/get';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';

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
  const { formData, onChange } = restProps;
  const { stateApi } = useStateManagerContext();
  const { options } = definition;
  const [fileItem, setFile] = useState<File | null>(null);

  const { toggleElementLoading } = useUIElementToolsLogic(definition.name);
  const { state } = useUIElementState(definition);

  useEffect(() => {
    if (!formData) return;

    const fileId = definition.options.documentData.id;
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

      const context = stateApi.getContext();
      let documentIndex = (context.documents as Document[]).findIndex(
        doc => doc.id === definition.options.documentData.id,
      );
      if (documentIndex === -1) {
        documentIndex = definition.options.mappingParams.documentIndex;
      }

      const documentPath = `documents[${documentIndex}]`;
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
    [stateApi, options, onChange, toggleElementLoading],
  );

  console.log('context', stateApi.getContext());

  return (
    <FileInputAdapter
      {...restProps}
      disabled={state.isLoading || restProps.disabled}
      formData={fileItem}
      onChange={handleChange}
    />
  );
};
