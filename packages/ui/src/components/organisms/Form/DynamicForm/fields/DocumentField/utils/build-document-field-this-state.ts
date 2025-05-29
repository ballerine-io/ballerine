import { AnyObject } from '@/common';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { IFormElement } from '../../../types';
import { IDocumentFieldParams } from '../DocumentField';
import { IDocumentState } from '../hooks/useDocumentState';
import { IDocument } from '@/components/organisms/Form/DocumentsService/types';

export const buildDocumentFieldThisState = (
  context: AnyObject,
  _metadata: AnyObject,
  stack: TDeepthLevelStack,
) => {
  const metadata = _metadata as unknown as {
    element: IFormElement<'documentfield', IDocumentFieldParams>;
    documents: IDocument[];
  };

  const elementContext: IDocumentState = {
    document: undefined,
    element: metadata.element,
  };

  return { $this: elementContext };
};
