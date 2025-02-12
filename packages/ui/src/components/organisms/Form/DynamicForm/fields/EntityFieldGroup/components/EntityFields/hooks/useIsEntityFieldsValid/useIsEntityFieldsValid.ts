import { useDynamicForm } from '@/components/organisms/Form/DynamicForm/context';
import { useValidationSchema } from '@/components/organisms/Form/DynamicForm/hooks/internal/useValidationSchema';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { formatValueDestination } from '@/components/organisms/Form/Validator';
import { validate } from '@/components/organisms/Form/Validator/utils/validate';
import { useMemo } from 'react';
import { useStack } from '../../../../../FieldList';

export const useEntityFieldsIsValid = (
  element: IFormElement<any, any>,
  entityGroupIndex: number,
) => {
  const { values } = useDynamicForm();
  const { stack } = useStack();

  const validationSchema = useValidationSchema(element.children || []);

  const isValid = useMemo(() => {
    const validationErrors = validate(
      values,
      validationSchema.map(schema => ({
        ...schema,
        valueDestination: formatValueDestination(schema.valueDestination!, [
          ...(stack || []),
          entityGroupIndex,
        ]),
      })),
    );

    return validationErrors?.length === 0;
  }, [validationSchema, values, stack, entityGroupIndex]);

  return isValid;
};
