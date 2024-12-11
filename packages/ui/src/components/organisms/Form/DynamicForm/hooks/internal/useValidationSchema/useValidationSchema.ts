import { useMemo } from 'react';

import { convertFormElementsToValidationSchema } from '../../../helpers/convert-form-emenents-to-validation-schema';
import { IFormElement } from '../../../types';

export const useValidationSchema = (elements: IFormElement[]) => {
  const validationSchema = useMemo(() => {
    return convertFormElementsToValidationSchema(elements);
  }, [elements]);

  return validationSchema;
};
