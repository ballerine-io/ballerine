import { EngineManager } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { JmespathRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import {
  ErrorField,
  RuleEngine,
} from '@/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { Document, DocumentsValidatorRule, Rule, UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export class DocumentsRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'destination-engine';
  private ruleManager = new EngineManager([new JmespathRuleEngine(), new JsonLogicRuleEngine()]);

  validate(context: AnyObject, rule: unknown, definition: UIElement<AnyObject>, state: UIState) {
    if (this.isDestinationValidatorRule(rule)) {
      const errors: ErrorField[] = [];

      rule.value.forEach(params => {
        const isRequired = this.isRule(params.required)
          ? this.ruleManager
              .getEngine(params.required.type)
              .validate(context, params.required, definition, state).isValid
          : params.required;

        const document = ((context.documents || []) as Document[]).find(
          doc => doc && doc.id === params.documentId,
        );
        const value = document ? (get(document, params.destination) as unknown) : undefined;

        if (isRequired && value === undefined) {
          const error: ErrorField = {
            fieldId: `document-error-${params.documentId}`,
            message: params.errorMessage,
            type: 'error',
          };

          errors.push(error);
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
      };
    }

    throw new Error(`Invalid rule provided to ${this.ENGINE_NAME}`);
  }

  test() {
    return true;
  }

  private isRule(rule: unknown): rule is Rule {
    return typeof rule === 'object' && 'type' in rule;
  }

  private isDestinationValidatorRule(rule: unknown): rule is DocumentsValidatorRule {
    return typeof rule === 'object' && 'type' in rule && rule.type === this.ENGINE_NAME;
  }
}
