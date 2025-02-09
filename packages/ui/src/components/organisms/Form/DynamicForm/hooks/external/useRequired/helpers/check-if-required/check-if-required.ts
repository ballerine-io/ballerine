import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { IFormElement } from '../../../../../types';
import { replaceTagsWithIndexesInRule } from '../../../useRules';

export const checkIfRequired = (
  element: IFormElement,
  context: object,
  stack: TDeepthLevelStack,
) => {
  const { validate = [] } = element;

  const requiredLikeValidators = validate.filter(
    validator => validator.type === 'required' || validator.considerRequired,
  );

  const isRequired = requiredLikeValidators.length
    ? requiredLikeValidators.some(validator => {
        const { applyWhen } = validator;
        const shouldValidate = applyWhen
          ? executeRules(context, [...replaceTagsWithIndexesInRule([applyWhen], stack)]).every(
              result => result.result,
            )
          : true;

        if (!shouldValidate) return false;

        return true;
      })
    : false;

  return isRequired;
};
