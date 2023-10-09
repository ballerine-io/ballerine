import {
  ErrorField,
  RuleEngine,
} from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { Rule } from '@app/domains/collection-flow';
import Ajv from 'ajv';

export class JsonSchemaRuleEngine implements RuleEngine {
  public readonly ENGINE_NAME = 'json-schema';

  test(context: unknown, rule: Rule) {
    const validator = new Ajv({ allErrors: true });
    const validationResult = validator.validate(rule.value, context);
    if (!validationResult) {
      const validationErrorMessage = this.__extractErrorsWithFields(validator);

      return { isValid: false, errors: validationErrorMessage.flat() };
    }

    return { isValid: true, errors: [] };
  }

  private __extractErrorsWithFields(validator: Ajv) {
    return validator.errors?.map(error => {
      const erroredParams = Object.values(error.params) as string[];
      const uniqueErroredParams = Array.from(new Set(erroredParams));

      return uniqueErroredParams.map(erroredParam => {
        const field = error.instancePath
          .split('/')
          .filter(part => part !== '')
          .concat(erroredParam)
          .join('.');
        return { field, message: error.message } as ErrorField;
      });
    });
  }
}
