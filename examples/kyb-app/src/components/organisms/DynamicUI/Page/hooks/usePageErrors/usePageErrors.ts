import { useMemo } from 'react';
import { Document } from '@app/domains/collection-flow';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { AnyObject } from '@ballerine/ui';

export const usePageErrors = (context: AnyObject): ErrorField[] => {
  const { documents } = context;

  const pageErrors = useMemo(() => {
    const errors: ErrorField[] = [];

    (documents as Document[])?.forEach((document, index) => {
      if (!(document.decision?.status == 'revision' || document.decision?.status == 'rejected')) {
        return;
      }
      const fieldId = `documents[${index}].page[0]`;
      const message = document.decision.revisionReason;

      errors.push({ fieldId, message, type: 'warning', fieldDestination: fieldId });
    });

    return errors;
  }, [documents]);

  return pageErrors;
};
