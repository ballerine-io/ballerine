import { useCallback, useState } from 'react';
import { IFormElement } from '../../../../types';
import { IDocumentFieldParams, IDocumentTemplate } from '../../DocumentField';

export interface IDocumentState {
  fileId?: string;
  document?: IDocumentTemplate;
  element: IFormElement<'documentfield', IDocumentFieldParams>;
}

export const useDocumentState = (element: IFormElement<'documentfield', IDocumentFieldParams>) => {
  const [documentState, setDocumentState] = useState<IDocumentState>({
    fileId: undefined,
    document: undefined,
    element,
  });

  const updateState = useCallback(
    (fileId?: string, document?: IDocumentTemplate) => {
      setDocumentState({ element, fileId, document });
    },
    [element],
  );

  return { documentState, updateState };
};
