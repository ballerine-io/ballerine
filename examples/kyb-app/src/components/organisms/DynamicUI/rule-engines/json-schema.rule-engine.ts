import {
  ErrorField,
  RuleEngine,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import Ajv from 'ajv/dist/2019';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

export class JsonSchemaRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-schema';

  test(context: unknown, rule: Rule, definition: UIElement<AnyObject>) {
    const validator = new Ajv({ allErrors: true, useDefaults: true, strict: 'log' });
    addFormats(validator, {
      formats: ['email', 'uri', 'date', 'date-time'],
      keywords: true,
    });
    ajvErrors(validator, { singleError: true });

    const validationResult = validator.validate(rule.value, context);
    if (!validationResult) {
      const validationErrorMessage = this.__extractErrorsWithFields(validator, definition);

      return { isValid: false, errors: validationErrorMessage.flat() };
    }

    return { isValid: true, errors: [] };
  }

  private __extractErrorsWithFields(validator: Ajv, definition: UIElement<AnyObject>) {
    const result = validator.errors?.map(error => {
      const erroredParams = Object.values(error.params) as string[];
      const uniqueErroredParams = Array.from(new Set(erroredParams));

      return uniqueErroredParams.map(_ => {
        const fieldId = error.instancePath.split('/').filter(part => part !== '');

        if (error.params.missingProperty) {
          fieldId.push(
            (error.params.missingProperty as string) ||
              error.params.errors[0]?.params.missingProperty,
          );
        }

        if (Array.isArray(error.params.errors) && error.params.errors[0]?.params.missingProperty) {
          fieldId.push(
            (error.params.missingProperty as string) ||
              error.params.errors[0]?.params.missingProperty,
          );
        }

        return {
          fieldId: fieldId.join('.').replaceAll(/\.(\d+)\./g, '[$1].'),
          message: error.message,
          definitionName: definition.name,
          fieldDestination: definition.valueDestination,
        } as ErrorField;
      });
    });

    return result.flat().filter(result => Boolean(result.message));
  }
}
