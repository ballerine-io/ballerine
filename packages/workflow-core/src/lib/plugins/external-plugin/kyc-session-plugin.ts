import { AnyRecord } from '@ballerine/common';
import { ApiPlugin } from './api-plugin';
import { JsonSchemaValidator } from '../../utils/context-validator/json-schema-validator';
import { Validator } from '../../utils';

const kycSessionRequestSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    callbackUrl: {
      type: 'string',
    },
    vendor: {
      type: 'string',
    },
  },
  required: ['firstName', 'lastName', 'callbackUrl', 'vendor'],
};

const kycSessionResponseSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
  },
  required: ['id', 'url'],
};

export class KycSessionPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'kyc-session';

  async validateContent<TValidationContext extends 'Request' | 'Response'>(
    schemaValidator: Validator | undefined,
    transformedRequest: AnyRecord,
    validationContext: TValidationContext,
  ) {
    return super.validateContent(
      new JsonSchemaValidator(
        validationContext === 'Request' ? kycSessionRequestSchema : kycSessionResponseSchema,
      ),
      transformedRequest,
      validationContext,
    );
  }

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const callbackUrlWithPlaceholder = this.replaceValuePlaceholders(
      payload['callbackUrl'] as string,
      payload,
    );
    const callbackUrl = new URL(callbackUrlWithPlaceholder);
    callbackUrl.searchParams.set('processName', 'kyc-unified-api');
    payload['callbackUrl'] = callbackUrl.toString();

    return super.makeApiRequest(url, method, payload, headers);
  }
}
