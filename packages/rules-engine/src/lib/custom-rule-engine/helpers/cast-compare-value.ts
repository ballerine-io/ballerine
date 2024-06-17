import { CustomRuleInput } from '@/lib/custom-rule-engine/types/custom-rule-input';
import { castValue } from '@/lib/custom-rule-engine/helpers/cast-value';
import { logger } from 'nx/src/utils/logger';
import { InvalidEvalValueError } from '@/lib/errors/invalid-eval-value-error';
// @ts-ignore - no types
import { safeEval } from 'safe-eval';

const isJavascript = (value: string) => {
  return value.startsWith('`') && value.endsWith('`');
};

export const castCompareWithEval = (options: CustomRuleInput['options'], value: string) => {
  try {
    if (isJavascript(value)) {
      return castValue(options, safeEval(value));
    }
  } catch (e) {
    logger.error(`Error while evaluating value: ${value}`);

    throw new InvalidEvalValueError(value);
  }

  return castValue(options, value);
};
