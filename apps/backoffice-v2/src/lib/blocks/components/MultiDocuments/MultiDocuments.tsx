import { FunctionComponent, useMemo } from 'react';
import { IMultiDocumentsProps } from './interfaces';
import { Case } from '@/pages/Entity/components/Case/Case';

export const MultiDocuments: FunctionComponent<IMultiDocumentsProps> = ({ value }) => {
  const documents = useMemo(
    () => value?.data?.filter(({ imageUrl, base64 }) => imageUrl || base64),
    [value?.data],
  );

  return (
    <div className={`m-2 rounded p-1`}>
      <Case.Documents
        documents={documents}
        isDocumentEditable={value?.isDocumentEditable}
        isLoading={value?.isLoading}
        onOcrPressed={value?.onOcrPressed}
        isLoadingOCR={value?.isLoadingOCR}
      />
    </div>
  );
};
