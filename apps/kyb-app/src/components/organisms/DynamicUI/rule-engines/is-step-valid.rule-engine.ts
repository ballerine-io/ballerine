import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import {
  RuleEngine,
  RuleTestResult,
} from '@/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { validate } from '@/components/providers/Validator/hooks/useValidate';
import { UIElement, UIPage, ValidContextRule } from '@/domains/collection-flow';
import { transformV1UIElementsToV2UIElements } from '@/pages/CollectionFlowV2/helpers';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class IsStepValidRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'is-step-valid';

  validate(
    context: unknown,
    _: unknown,
    element: UIElement<AnyObject>,
    __: UIState,
    uiPage: UIPage,
  ): RuleTestResult {
    console.log(`Executing rule engine ${this.ENGINE_NAME}`);

    const uiEelemntsV2 = transformV1UIElementsToV2UIElements(uiPage?.elements || []);
    const validationErrors = validate(uiEelemntsV2, context as AnyObject);

    const result = { isValid: !validationErrors.length, errors: [] };

    console.log(`Result of rule engine ${this.ENGINE_NAME}:`, {
      isValid: !validationErrors.length,
      errors: validationErrors,
    });

    return result;
  }

  test(context: unknown, rule: unknown) {
    if (this.isValidContextRule(rule)) {
      return jsonLogic.apply(rule.value, context as AnyObject) as boolean;
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  private isValidContextRule(rule: unknown): rule is ValidContextRule {
    return (
      typeof rule === 'object' && rule !== null && 'type' in rule && rule.type === 'json-logic'
    );
  }
}
