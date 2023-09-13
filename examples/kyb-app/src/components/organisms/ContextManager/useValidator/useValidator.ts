import { Action, UIElement } from '@app/components/organisms/DynamicElements/types';
import { RJSFSchema } from '@rjsf/utils';
import Ajv from 'ajv';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import debounce from 'lodash/debounce';
import { AnyObject } from '@ballerine/ui';

const validator = new Ajv();

interface ValidationPayload {
  schema: RJSFSchema;
  value: Record<string, any>;
  definition: UIElement<any>;
}

export const useValidator = <TContext>(definitions: UIElement<any>[], context: TContext) => {
  const [errors, setErrors] = useState<AnyObject>({});

  const errorsRef = useRef(errors);

  const buildSchemasAndValidationValues = useCallback(
    (definitions: UIElement<any>[], context: TContext): ValidationPayload[] => {
      const schemasAndValidationValues = definitions.reduce((payload, definition) => {
        if (!definition.validationSchema) return payload;

        const schema: RJSFSchema = {
          type: 'object',
          required: definition.required ? [definition.name] : [],
          properties: {
            [definition.name]: definition.validationSchema,
          },
        };

        const validationValue = {
          [definition.name]: get(context, definition.valueDestination) as unknown,
        };

        payload.push({ schema, value: validationValue, definition });

        return payload;
      }, [] as ValidationPayload[]);

      return schemasAndValidationValues;
    },
    [],
  );

  const validateContext = useMemo(
    () =>
      debounce((definitions: UIElement<any>[], context: TContext) => {
        const validationPayload = buildSchemasAndValidationValues(definitions, context);

        validationPayload.forEach(payload => {
          const validate = validator.compile(payload.schema);
          validate(payload.value);

          const errors = validate.errors;

          if (Array.isArray(errors) && errors.length) {
            set(errorsRef.current, payload.definition.valueDestination, errors.at(-1).message);
          } else {
            set(errorsRef.current, payload.definition.valueDestination, undefined);
          }
        });

        setErrors({ ...errorsRef.current });
      }, 500),
    [errorsRef, buildSchemasAndValidationValues],
  );

  useEffect(() => {
    validateContext(definitions, context);
  }, [definitions, context, validateContext]);

  return {
    errors,
  };
};
