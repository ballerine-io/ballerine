import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import { findDocumentDefinitionById } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { Document, UIElement, UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export interface PageError {
  page: number;
  pageName: string;
  stateName: string;
  errors: ErrorField[];
  _elements: Array<UIElement<AnyObject>>;
}

export const selectDirectors = (context: AnyObject) =>
  (context?.entity?.data?.additionalInfo?.directors as AnyObject[]) || [];

export const selectDirectorsDocuments = (context: unknown): Document[] =>
  //@ts-ignore
  selectDirectors(context)
    .map(director => director.additionalInfo?.documents)
    ?.filter(Boolean)
    ?.flat() || [];

export const usePageErrors = (context: CollectionFlowContext, pages: UIPage[]): PageError[] => {
  return useMemo(() => {
    const pagesWithErrors: PageError[] = pages.map(page => {
      const pageNumber = context?.collectionFlow?.state?.steps?.findIndex(
        step => step.stepName === page.stateName,
      );

      const pageErrorBase: PageError = {
        page: pageNumber !== -1 ? Number(pageNumber) + 1 : page.number,
        pageName: page.name,
        stateName: page.stateName,
        errors: [],
        _elements: page.elements,
      };

      return pageErrorBase;
    });

    pagesWithErrors.forEach(pageError => {
      pageError.errors = [
        ...((context.documents as Document[]) || []),
        ...selectDirectorsDocuments(context),
      ]
        .filter(document => {
          if (
            //@ts-ignore
            !(document?.decision?.status == 'revision' || document?.decision?.status == 'rejected')
          ) {
            return false;
          }

          const definition = findDocumentDefinitionById(document.id as string, pageError._elements);

          return Boolean(definition);
        })
        .map(document => {
          //@ts-ignore
          const documentPath = `document-error-${document.id as string}`;
          //@ts-ignore
          const message = document?.decision?.revisionReason as string;

          return {
            fieldId: documentPath,
            fieldDestination: documentPath,
            message,
            type: 'warning',
          };
        });
    });

    return pagesWithErrors;
  }, [pages, context]);
};
