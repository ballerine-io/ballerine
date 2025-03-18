import { useMemo } from 'react';
import { toTitleCase } from 'string-ts';
import { IDocumentFieldParams } from '../..';
import { IFormElement } from '../../../../types';

// Overrides definition label with Category and Type of document.
// May be changed or reverted in the future.

export const useDocumentLabelElement = (element: IFormElement<string, IDocumentFieldParams>) =>
  useMemo(
    () => ({
      ...element,
      params: {
        ...element.params,
        label: `${toTitleCase(element?.params?.template?.category ?? 'N/A')} - ${toTitleCase(
          element?.params?.template?.type ?? 'N/A',
        )}`,
      },
    }),
    [element],
  );
