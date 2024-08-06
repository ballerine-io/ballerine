import { useValidate } from '@/components/providers/Validator/hooks/useValidate';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElementV2 } from '@/components/providers/Validator/types';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { TValidationErrors, validatorContext } from './validator.context';

const { Provider } = validatorContext;

export interface IValidatorProps {
  children: React.ReactNode | React.ReactNode[];
  context: unknown;
  elements: UIElementV2[];
}

export const Validator: FunctionComponent<IValidatorProps> = ({ children, elements, context }) => {
  const validate = useValidate({ elements, context });
  const [validationErrors, setValiationErrors] = useState<TValidationErrors>({});

  const onValidate = useCallback(() => {
    const errors = validate();
    const validationErrors = errors.reduce((acc, error) => {
      const element = new UIElement(error.element, context, error.stack);
      acc[element.getId()] = [...(acc[element.getId()] || []), error.message];

      return acc;
    }, {} as TValidationErrors);

    setValiationErrors(validationErrors);

    return Boolean(errors.length);
  }, [validate]);

  const ctx = useMemo(
    () => ({ validate: onValidate, errors: validationErrors }),
    [validationErrors, onValidate],
  );

  return <Provider value={ctx}>{children}</Provider>;
};
