import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { IFormElement } from '../../../../../types';

export const checkIfRequired = (element: IFormElement, context: object) => {
  const { validate = [] } = element;

  const requiredLikeValidators = validate.filter(
    validator => validator.type === 'required' || validator.considerRequired,
  );

  const isRequired = requiredLikeValidators.length
    ? requiredLikeValidators.some(validator => {
        const { applyWhen } = validator;
        const shouldValidate = applyWhen
          ? executeRules(context, [applyWhen]).every(result => result.result)
          : true;

        if (!shouldValidate) return false;

        return true;
      })
    : false;

  return isRequired;
};
