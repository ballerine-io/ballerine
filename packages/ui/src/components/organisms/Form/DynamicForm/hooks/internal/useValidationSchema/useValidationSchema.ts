import { useMemo } from 'react';

import { convertFormElementsToValidationSchema } from '../../../helpers/convert-form-emenents-to-validation-schema';
import { IFormElement } from '../../../types';
import { useDocumentsService } from '@/components/organisms/Form/DocumentsService/hooks/internal/useDocumentsService';
import { useDynamicForm } from '../../../context';

export const useValidationSchema = (elements: Array<IFormElement<any, any>>) => {
  const { metadata } = useDynamicForm();
  const { documents } = useDocumentsService();

  const validationSchema = useMemo(
    () => convertFormElementsToValidationSchema(elements, documents, metadata),
    [elements, documents, metadata],
  );

  return validationSchema;
};
