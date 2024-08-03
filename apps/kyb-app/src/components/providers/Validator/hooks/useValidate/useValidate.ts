import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { ValueValidatorManager } from '@/components/providers/Validator/value-validator-manager';
import { useCallback } from 'react';

interface IUseValidateParams {
  elements: UIElementV2[];
  context: unknown;
}

export interface IValidationError {
  id: string;
  message: string;
  element: UIElementV2;
  valueDestination: string;
  stack: number[];
}

export const useValidate = ({ elements, context }: IUseValidateParams) => {
  const validate = useCallback(() => {
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

    // const valiateFn = (
    //   elements: UIElementV2[],
    //   meta: { parent: UIElementV2 | null; deepthLevel: number } = { parent: null, deepthLevel: 0 },
    // ) => {
    //   for (const element of elements) {
    //     if (element.type === 'ui') continue;

    //     if (element.type === 'field') {
    //       errors = [...errors, ...fieldValidationStrategy(element, meta?.parent || undefined)];
    //     }

    //     if (element.type === 'field-list') {
    //       errors = [...errors, ...arrayValidationStrategy(element, meta.deepthLevel)];
    //     }

    //     if (element.children) {
    //       valiateFn(element.children, {
    //         ...meta,
    //         deepthLevel: meta.deepthLevel + 1,
    //         parent: element,
    //       });
    //     }
    //   }
    // };

    validateFn(elements, context as any);

    return errors;
  }, [elements, context]);

  return validate;
};
