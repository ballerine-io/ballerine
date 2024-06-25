import {
  ErrorField,
  RuleEngine,
} from '@/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { Rule, UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import ajvErrors from 'ajv-errors';
import addFormats, { FormatName } from 'ajv-formats';
import Ajv, { ErrorObject } from 'ajv/dist/2019';
import uniqBy from 'lodash/uniqBy';

export class JsonSchemaRuleEngine implements RuleEngine {
  static ALLOWED_FORMATS: FormatName[] = ['email', 'uri', 'date', 'date-time'];
  static ENGINE_NAME: Rule['type'] = 'json-schema';

  public readonly ENGINE_NAME = JsonSchemaRuleEngine.ENGINE_NAME;

  // @ts-ignore
  validate(context: unknown, rule: Rule, definition: UIElement<AnyObject>) {
    const validator = new Ajv({ allErrors: true, useDefaults: true });
    addFormats(validator, {
      formats: JsonSchemaRuleEngine.ALLOWED_FORMATS,
      keywords: true,
    });
    ajvErrors(validator, { singleError: true });

    const validationResult = validator.validate(rule.value, context);
    if (!validationResult) {
      const validationErrorMessage = this.extractErrorsWithFields(validator, definition);

      return { isValid: false, errors: validationErrorMessage?.flat() };
    }

    return { isValid: true, errors: [] };
  }

  test(context: unknown, rule: Rule) {
    const validator = new Ajv({ allErrors: true, useDefaults: true });
    addFormats(validator, {
      formats: ['email', 'uri', 'date', 'date-time'],
      keywords: true,
    });
    ajvErrors(validator, { singleError: true });

    const validationResult = validator.validate(rule.value, context);

    return validationResult;
  }

  private extractErrorsWithFields(validator: Ajv, definition: UIElement<AnyObject>) {
    console.log({ errors: validator.errors, definition });
    const result = validator.errors?.map(error => {
      const erroredParams = Object.values(error.params) as string[];
      const uniqueErroredParams = Array.from(new Set(erroredParams));
      const fieldErrors: ErrorField[] = [];

      uniqueErroredParams.forEach(_ => {
        const fieldDestination = this.buildFieldDestination(error.instancePath, error);

        const messages = error.message?.split(';');

        messages?.forEach(messageText => {
          const sanitizedFieldId = fieldDestination.replaceAll(/\.(\d+)\./g, '[$1].');
          fieldErrors.push(
            this.createFieldError(
              sanitizedFieldId,
              messageText,
              definition.name,
              // @ts-ignore
              definition.valueDestination,
            ),
          );
        });
      });

      return fieldErrors;
    });

    return uniqBy(
      result?.flat()?.filter(result => Boolean(result.message)),
      'message',
    );
  }

  private buildFieldDestination(
    instancePath: string,
    error: ErrorObject<string, Record<string, any>, unknown>,
  ): string {
    const fieldDestination = instancePath.split('/').filter(part => part !== '');

    if (error.params?.missingProperty) {
      fieldDestination.push(
        (error.params.missingProperty as string) ||
          (((error.params.errors as Array<AnyObject>)[0]?.params as AnyObject)
            .missingProperty as string),
      );
    }

    if (
      Array.isArray(error.params.errors) &&
      ((error.params.errors as Array<AnyObject>)[0]?.params as AnyObject)?.missingProperty
    ) {
      fieldDestination.push(
        (error.params.missingProperty as string) ||
          (((error.params.errors as Array<AnyObject>)[0]?.params as AnyObject)
            .missingProperty as string),
      );
    }

    return fieldDestination.join('.');
  }

  private createFieldError(
    fieldId: string,
    message: string,
    definitionName: string,
    fieldDestination: string,
    type: ErrorField['type'] = 'error',
  ): ErrorField {
    const fieldError: ErrorField = {
      fieldId,
      message,
      definitionName,
      fieldDestination,
      type,
    };

    return fieldError;
  }
}
