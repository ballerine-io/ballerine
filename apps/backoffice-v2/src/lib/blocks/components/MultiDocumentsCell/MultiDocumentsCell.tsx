import { FunctionComponent, useMemo } from 'react';
import { IMultiDocumentsProps } from './interfaces';
import { Case } from '@/pages/Entity/components/Case/Case';

export const MultiDocuments: FunctionComponent<IMultiDocumentsProps['value']> = ({
  data,
  isDocumentEditable,
  isLoading,
  onOcrPressed,
  isLoadingOCR,
}) => {
  const documents = useMemo(() => data?.filter(({ imageUrl }) => !!imageUrl), [data]);

  return (
    <div className={`m-2 rounded p-1`}>
      <Case.Documents
        documents={documents}
        isDocumentEditable={isDocumentEditable}
        isLoading={isLoading}
        onOcrPressed={onOcrPressed}
        isLoadingOCR={isLoadingOCR}
      />
    </div>
  );
};

export const MultiDocumentsCell: FunctionComponent<IMultiDocumentsProps> = ({ value }) => {
  return (
    <MultiDocuments
      data={value?.data}
      isDocumentEditable={value?.isDocumentEditable}
      isLoading={value?.isLoading}
      onOcrPressed={value?.onOcrPressed}
      isLoadingOCR={value?.isLoadingOCR}
    />
  );
};
