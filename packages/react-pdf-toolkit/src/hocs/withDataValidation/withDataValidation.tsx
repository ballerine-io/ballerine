import { TSchema } from '@sinclair/typebox';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import React from 'react';

export function withDataValidation<TComponentProps extends { data: unknown }>(
  Component: React.FunctionComponent<TComponentProps>,
  schema: TSchema,
): React.FunctionComponent<TComponentProps> {
  function ValidationWrapper(props: TComponentProps) {
    const ajv = new Ajv();
    ajvFormats(ajv);

    const isValid = ajv.validate(schema, props.data);

    if (!isValid) {
      throw new Error(
        JSON.stringify({
          message: 'Validation failed',
          errors: ajv.errors,
        }),
      );
    }

    return <Component {...props} />;
  }

  ValidationWrapper.displayName = `withDataValidation(${Component.displayName})`;

  return ValidationWrapper;
}
