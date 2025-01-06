import { useMemo } from 'react';

import { convertFormElementsToValidationSchema } from '../../../helpers/convert-form-emenents-to-validation-schema';
import { IFormElement } from '../../../types';

export const useValidationSchema = (elements: Array<IFormElement<any, any>>) => {
  const validationSchema = useMemo(
    () => convertFormElementsToValidationSchema(elements),
    [elements],
  );

  return validationSchema;
};
