import { useCallback, useState } from 'react';
import { IFormElement } from '../../../../types';
import { IDocumentFieldParams } from '../../DocumentField';
import { IDocument } from '@/components/organisms/Form/DocumentsService/types';

export interface IDocumentState {
  document?: IDocument;
  element: IFormElement<'documentfield', IDocumentFieldParams>;
}

export const useDocumentState = (element: IFormElement<'documentfield', IDocumentFieldParams>) => {
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
