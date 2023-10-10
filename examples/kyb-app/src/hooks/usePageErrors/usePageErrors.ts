import { useMemo } from 'react';
import { IRule, UIPage } from '@app/domains/collection-flow';

export type TError = {
  message: string;
  field: string;
  type: 'error' | 'warning';
};
type ElementType = {
  valueDestination?: string;
  elements?: ElementType[];
};

export const usePageErrors = (context: Record<string, any>, pages: UIPage[], errors?: TError[]) => {
  const pageErrors = useMemo(() => {
    const pagesWithErrors: {
      page: number;
      pageName: string;
      stateName: string;
      errors: TError[];
    }[] = [];

    context.documents.each((document, index) => {
      if (!(document.decision?.status == 'revision' || document.decision?.status == 'rejected')) {
        return;
      }
      const field = `documents[${index}].page[0]`;
      const message = document.decision.revisionReason;

      errors?.push({ field, message, type: 'warning' });
    });

    pages.map((page, pageIndex) => {
      const destinationValues: string[] = [];
      const pageErrors: TError[] = [];

      const traverseElements = (elements: ElementType[]) => {
        for (const element of elements) {
          if (element.valueDestination) {
            destinationValues.push(element.valueDestination);
          }
          if (element.elements) {
            traverseElements(element.elements);
          }
        }
      };

      traverseElements(page.elements);

      // const rule = page.actions.map(action => action.dispatchOn?.rules?.find(rule => (rule as IRule)?.persistStateRule))[0] as IRule;
      errors?.map(error => {
        if (destinationValues.includes(error.field)) {
          pageErrors.push(error);
        }
      });

      if (pageErrors.length) {
        pagesWithErrors.push({
          page: pageIndex,
          pageName: page.name,
          stateName: page.stateName,
          errors: pageErrors,
        });
      }
    });

    return pagesWithErrors;
  }, [pages, context, errors]);

  return pageErrors;
};
