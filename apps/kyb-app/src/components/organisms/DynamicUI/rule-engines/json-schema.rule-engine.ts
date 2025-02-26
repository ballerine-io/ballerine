import { AnyObject } from '@ballerine/ui';
import ajvErrors from 'ajv-errors';
import addFormats, { FormatName } from 'ajv-formats';
import Ajv, { ErrorObject } from 'ajv/dist/2019';
import dayjs from 'dayjs';
import uniqBy from 'lodash/uniqBy';

import {
  ErrorField,
  RuleEngine,
} from '@/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';
import { Rule, UIElement } from '@/domains/collection-flow';

const addCustomFormats = (validator: Ajv) => {
  validator.addFormat('non-past-date', {
    type: 'string',
    validate: (dateString: string) => {
      const inputDate = dayjs(dateString);

      if (!inputDate.isValid()) {
        return false;
      }

      return inputDate.startOf('day').valueOf() >= dayjs().startOf('day').valueOf();
    },
  });

  validator.addFormat('minAge', {
    type: 'string',
    validate: (dateString: string, schema?: { minAge?: number }) => {
      const inputDate = dayjs(dateString);

      if (!inputDate.isValid()) {
        return false;
      }

      // Default to 18 if not specified
      const requiredAge = schema?.minAge || 18;
      const today = dayjs();
      const birthDate = dayjs(dateString);

      // Calculate age
      let age = today.year() - birthDate.year();
      const monthDiff = today.month() - birthDate.month();

      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
        age--;
      }

      return age >= requiredAge;
    },
  });
};

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

    addCustomFormats(validator);

    const validationResult = validator.validate(rule.value, context);

    if (!validationResult) {
      const validationErrorMessage = this.extractErrorsWithFields(validator, definition);

      return { isValid: false, errors: validationErrorMessage?.flat() };
    }

    return { isValid: true, errors: [] };
  }

  test(context: unknown, rule: Rule) {
    const validator = new Ajv({ allErrors: true, useDefaults: true, $data: true });

    addFormats(validator, {
      formats: ['email', 'uri', 'date', 'date-time'],
      keywords: true,
    });

    ajvErrors(validator, { singleError: true });

    addCustomFormats(validator);

    return validator.validate(rule.value, context);
  }

  private extractErrorsWithFields(validator: Ajv, definition: UIElement<AnyObject>) {
    const result = validator.errors?.map(error => {
      const erroredParams = Object.values(error.params) as string[];
      const uniqueErroredParams = Array.from(new Set(erroredParams));
      const fieldErrors: ErrorField[] = [];

      uniqueErroredParams.forEach(_ => {
        const fieldDestination = this.buildFieldDestination(error.instancePath, error);

        const messages = error.message?.split(';');

        messages?.forEach(messageText => {
          let formattedFieldId = fieldDestination.replaceAll(/\.(\d+)\.?/g, '[$1].');

          if (formattedFieldId.at(-1) === '.') {
            formattedFieldId = formattedFieldId.slice(0, -1);
          }

          fieldErrors.push(
            this.createFieldError(
              formattedFieldId,
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
          (((error.params.errors as AnyObject[])[0]?.params as AnyObject)
            .missingProperty as string),
      );
    }

    if (
      Array.isArray(error.params.errors) &&
      ((error.params.errors as AnyObject[])[0]?.params as AnyObject)?.missingProperty
    ) {
      fieldDestination.push(
        (error.params.missingProperty as string) ||
          (((error.params.errors as AnyObject[])[0]?.params as AnyObject)
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
