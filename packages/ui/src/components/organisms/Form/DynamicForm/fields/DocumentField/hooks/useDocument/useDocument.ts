import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { Document } from '@/domains/collection-flow';
import { IDocumentFieldParams } from '@/pages/CollectionFlowV2/components/ui/fields/DocumentField/DocumentField';
import remove from 'lodash/remove';
import set from 'lodash/set';
import { useCallback, useMemo } from 'react';

interface IUseDocumentParams {
  documents: Document[];
  params: IDocumentFieldParams;
  uiElement: UIElement;
}

export const useDocument = ({ documents, params, uiElement }: IUseDocumentParams) => {
  const { stateApi } = useStateManagerContext();

  const document = useMemo(() => {
    return documents?.find(document => document.id === params.initialData.id);
  }, [documents, params]);

  const setDocument = useCallback(
    (fileId: string) => {
      const { initialData, pageIndex = 0 } = params;

      if (!document) {
        const newDocument = structuredClone(initialData);
        if (!newDocument.pages) {
          newDocument.pages = [];
        }

        newDocument.pages[pageIndex] = { ballerineFileId: fileId };

        const newDocuments = [...documents, newDocument];

        const context = stateApi.getContext();
        set(context, uiElement.getValueDestination(), newDocuments);

        stateApi.setContext(context);
      } else {
        document.pages![pageIndex] = { ballerineFileId: fileId };

        const newDocuments = documents.map(document => {
          if (document.id === params.initialData.id) {
            return { ...document };
          }

          return document;
        });

        const context = stateApi.getContext();
        set(context, uiElement.getValueDestination(), newDocuments);

        stateApi.setContext(context);
      }
    },
    [params, uiElement, document, documents, stateApi],
  );

  const clearDocument = useCallback(() => {
    if (!document) return;

    const newDocument = structuredClone(document);
    const context = stateApi.getContext();

    // removing document page at pageIndex
    remove(newDocument?.pages || [], (page, index) => index === (params.pageIndex || 0));

    // if no pages left, remove the document from documents array
    if (!newDocument?.pages?.length) {
      const newDocuments = remove(documents, document => document.id === newDocument.id);

      set(context, uiElement.getValueDestination(), newDocuments);

      stateApi.setContext(context);
    } else {
      set(
        context,
        uiElement.getValueDestination(),
        documents.map(document => {
          if (document.id === newDocument.id) {
            return newDocument;
          }

          return document;
        }),
      );

      stateApi.setContext(context);
    }
  }, [params, document, documents, uiElement, stateApi]);

  const fileId = useMemo(() => {
    return document?.pages?.[params.pageIndex || 0]?.ballerineFileId;
  }, [document, params]);

  return { fileId, setDocument, clearDocument };
};
