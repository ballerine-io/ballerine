import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { IValidationError } from '@/components/providers/Validator/hooks/useValidate/useValidate';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { ValueValidatorManager } from '@/components/providers/Validator/value-validator-manager';

export const validate = (elements: UIElementV2[], context: object) => {
  const validatorManager = new ValueValidatorManager();
  let errors: IValidationError[] = [];

  const fieldValidationStrategy = (
    element: UIElement,
    stack: number[] = [],
  ): IValidationError[] => {
    const value = element.getValue();

    const validationErrors = element.getValidatorsParams().map(({ validator, params }) => {
      try {
        if (!element.isRequired() && value === undefined) return;

        validatorManager.validate(value, validator as any, params);
      } catch (error) {
        return {
          //@ts-ignore
          message: error.message,
          element: element.element,
          id: element.getId(),
          valueDestination: element.getValueDestination(),
          stack,
        };
      }
    });

    return validationErrors.filter(Boolean) as IValidationError[];
  };

  const validateFn = (elements: UIElementV2[], context: object, stack: number[] = []) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as UIElementV2;
      const uiElement = new UIElement(element, context, stack);
      if (!element) continue;

      if (element.type === 'field') {
        errors = [...errors, ...fieldValidationStrategy(uiElement, stack)];
        continue;
      }

      if (element.type === 'field-list') {
        const value = uiElement.getValue() as any[];

        errors = [...errors, ...fieldValidationStrategy(uiElement, stack)];

        if (!Array.isArray(value)) continue;

        value?.forEach((_, index) => {
          validateFn(element.children!, context, [...stack, index]);
        });
        continue;
      }

      if (element.children) {
        validateFn(element.children, context, stack);
      }
    }
  };

  validateFn(elements, context as any);

  return errors;
};
