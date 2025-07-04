import { useMemo } from 'react';

import { buildValidationSchemaFromFormElements } from '../../../helpers/build-validation-schema-from-form-elements';
import { useDocumentsService } from '@/components/organisms/Form/DocumentsService/hooks/internal/useDocumentsService';
import { useDynamicForm } from '../../../context';
import { TUIElement } from '@ballerine/common';

export const useValidationSchema = (elements: Array<TUIElement>) => {
  const { metadata } = useDynamicForm();
  const { documents } = useDocumentsService();

  const validationSchema = useMemo(
    () => buildValidationSchemaFromFormElements(elements, [], undefined),
    [elements, documents, metadata],
  );

  return validationSchema;
};
