import { useMemo } from 'react';

import { buildValidationSchemaFromFormElements } from '../../../helpers/build-validation-schema-from-form-elements';
import { IFormElement } from '../../../types';
import { useDocumentsService } from '@/components/organisms/Form/DocumentsService/hooks/internal/useDocumentsService';
import { useDynamicForm } from '../../../context';

export const useValidationSchema = (elements: Array<IFormElement<any, any>>) => {
  const { metadata } = useDynamicForm();
  const { documents } = useDocumentsService();

  const validationSchema = useMemo(
    () => buildValidationSchemaFromFormElements(elements, [], undefined),
    [elements, documents, metadata],
  );

  return validationSchema;
};
