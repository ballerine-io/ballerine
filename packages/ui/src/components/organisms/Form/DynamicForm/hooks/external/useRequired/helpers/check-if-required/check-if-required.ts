import { contextBuilders } from '@/components/organisms/Form/DynamicForm/context-builders';
import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { ICommonValidator, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { IFormElement } from '../../../../../types';
import { replaceTagsWithIndexesInRule } from '../../../useRules';

export const checkIfRequired = (
  element: IFormElement,
  context: object,
  stack: TDeepthLevelStack,
  globalValidationRules: Array<ICommonValidator<object, string>> = [],
) => {
  const { validate: _elementValidate = [] } = element;
  const validate = [..._elementValidate, ...globalValidationRules];

  const requiredLikeValidators = validate.filter(
    validator => validator.type === 'required' || validator.considerRequired,
  );
  const contextBuilder = contextBuilders[element.element];

  const isRequired = requiredLikeValidators.length
    ? requiredLikeValidators.some(validator => {
        const { applyWhen } = validator;
        const elementContext = contextBuilder?.(context, { element }, stack);
        const shouldValidate = applyWhen
          ? executeRules({ ...context, ...elementContext }, [
              ...replaceTagsWithIndexesInRule([applyWhen], stack),
            ]).every(result => result.result)
          : true;

        return shouldValidate;
      })
    : false;

  return isRequired;
};
