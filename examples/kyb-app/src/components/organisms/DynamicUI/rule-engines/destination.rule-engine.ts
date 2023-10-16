import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { JmespathRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import {
  ErrorField,
  RuleEngine,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { DocumentsValidatorRule, Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export class DestinationRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'destination-engine';
  private ruleManager = new EngineManager([new JmespathRuleEngine(), new JsonLogicRuleEngine()]);

  test(context: unknown, rule: unknown, definition: UIElement<AnyObject>, state: UIState) {
    if (this.isDestinationValidatorRule(rule)) {
      const errors: ErrorField[] = [];

      rule.value.forEach(params => {
        const isRequired = this.isRule(params.required)
          ? this.ruleManager
              .getEngine(params.required.type)
              .test(context, params.required, definition, state).isValid
          : params.required;

        const value = get(context, params.destination) as unknown;

        if (isRequired && value === undefined) {
          const error: ErrorField = {
            fieldId: params.destination,
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

  private isRule(rule: unknown): rule is Rule {
    return typeof rule === 'object' && 'type' in rule;
  }

  // private __validateDocuments(definition: UIElement<AnyObject>, context: AnyObject): ErrorField[] {
  //   const documents = this.__findDocumentElements(definition.elements);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   const requiredDocuments = definition.elements.find(
  //     element => element.type == 'json-form' && element.options?.jsonFormDefinition?.required,
  //   )?.options?.jsonFormDefinition?.required as Array<string>;

  //   return documents
  //     .filter(document => {
  //       requiredDocuments.includes(document.name);
  //     })
  //     .map(document => {
  //       if (context[document.valueDestination]) {
  //         return;
  //       } else {
  //         return {
  //           fieldId: document.valueDestination,
  //           message: `${document.options.label as string} is required`,
  //           definitionName: definition.name,
  //           fieldDestination: definition.valueDestination,
  //           type: 'error' as const,
  //         };
  //       }
  //     })
  //     .filter(Boolean);
  // }

  // private __findDocumentElements(elements: UIElement<AnyObject>[]): UIElement<AnyObject>[] {
  //   let documentElements: UIElement<AnyObject>[] = [];

  //   if (Array.isArray(elements)) {
  //     elements.forEach(element => {
  //       if (element.type === 'document') {
  //         documentElements.push(element);
  //       }

  //       if (element.elements) {
  //         documentElements = documentElements.concat(this.__findDocumentElements(element.elements));
  //       }
  //     });
  //   }

  //   return documentElements;
  // }

  private isDestinationValidatorRule(rule: unknown): rule is DocumentsValidatorRule {
    return typeof rule === 'object' && 'type' in rule && rule.type === this.ENGINE_NAME;
  }
}
