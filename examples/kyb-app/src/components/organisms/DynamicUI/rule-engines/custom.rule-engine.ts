import {
  ErrorField,
  RuleEngine,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { CustomRule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export class CustomRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'custom';

  test(context: unknown, rule: CustomRule, definition: UIElement<AnyObject>) {
    if (rule.value.validationContext == 'document') {
      const invalidDocumentsErrors = this.__validateDocuments(definition, context);

      return { isValid: invalidDocumentsErrors.length == 0, errors: invalidDocumentsErrors };
    }
    return { isValid: true, errors: [] };
  }

  private __validateDocuments(definition: UIElement<AnyObject>, context: AnyObject): ErrorField[] {
    const documents = this.__findDocumentElements(definition.elements);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const requiredDocuments = definition.elements.find(
      element => element.type == 'json-form' && element.options?.jsonFormDefinition?.required,
    )?.options?.jsonFormDefinition?.required as Array<string>;

    return documents
      .filter(document => {
        requiredDocuments.includes(document.name);
      })
      .map(document => {
        if (context[document.valueDestination]) {
          return;
        } else {
          return {
            fieldId: document.valueDestination,
            message: `${document.options.label as string} is required`,
            definitionName: definition.name,
            fieldDestination: definition.valueDestination,
            type: 'error' as const,
          };
        }
      })
      .filter(Boolean);
  }

  private __findDocumentElements(elements: UIElement<AnyObject>[]): UIElement<AnyObject>[] {
    let documentElements: UIElement<AnyObject>[] = [];

    if (Array.isArray(elements)) {
      elements.forEach(element => {
        if (element.type === 'document') {
          documentElements.push(element);
        }

        if (element.elements) {
          documentElements = documentElements.concat(this.__findDocumentElements(element.elements));
        }
      });
    }

    return documentElements;
  }
}
