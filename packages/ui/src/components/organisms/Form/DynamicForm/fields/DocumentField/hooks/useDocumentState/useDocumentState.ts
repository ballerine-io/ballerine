import { useCallback, useState } from 'react';
import { IDocument } from '@/components/organisms/Form/DocumentsService/types';
import { GetUIElementByType } from '@ballerine/common';

export interface IDocumentState {
  document?: IDocument;
  element: GetUIElementByType<'documentfield'>;
}

export const useDocumentState = (element: GetUIElementByType<'documentfield'>) => {
  const [documentState, setDocumentState] = useState<IDocumentState>({
    document: undefined,
    element,
  });

  const updateState = useCallback(
    (document: IDocument | undefined) => {
      setDocumentState({ element, document });
    },
    [element],
  );

  return { documentState, updateState };
};
