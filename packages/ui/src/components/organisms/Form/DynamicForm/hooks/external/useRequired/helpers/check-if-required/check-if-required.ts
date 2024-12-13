import { IRule } from '@/components/organisms/Form/hooks';
import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { IFormElement } from '../../../../../types';

export const checkIfRequired = (element: IFormElement, context: object) => {
  const { validate = [] } = element;

  const requiredLikeValidators = validate.filter(
    validator => validator.type === 'required' || validator.considerRequred,
  );

  const isRequired = requiredLikeValidators.length
    ? requiredLikeValidators.some(validator => {
        const { applyWhen = [] } = validator;
        const shouldValidate = (applyWhen as IRule[])?.length
          ? executeRules(context, applyWhen as IRule[]).every(result => result.result)
          : true;

        if (!shouldValidate) return false;

        return true;
      })
    : false;

  return isRequired;
};
