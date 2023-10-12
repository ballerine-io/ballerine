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

  useEffect(() => {
    if (!formData) return;

    const fileId = formData as string;

    const persistedFile = collectionFlowFileStorage.getFileById(fileId);

    if (persistedFile) {
      setFile(persistedFile);
    } else {
      toggleElementLoading();
      void fetchFile(fileId).then(file => {
        const createdFile = new File([''], file.fileNameInBucket || file.fileNameOnDisk, {
          type: 'text/plain',
        });

        collectionFlowFileStorage.registerFile(fileId, createdFile);
        toggleElementLoading();
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

  return <FileInputAdapter {...restProps} formData={fileItem} onChange={handleChange} />;
};
