import { TValidators } from '../../utils/types';
import { AnyRecord } from '@ballerine/common';
import { ApiPlugin, IApiPluginParams } from './api-plugin';
import { JsonSchemaValidator } from '../../utils/context-validator/json-schema-validator';

const kycIndividualRequestSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    endUserId: {
      type: 'string',
    },
    callbackUrl: {
      type: 'string',
    },
    person: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        idNumber: {
          type: 'string',
        },
        gender: {
          type: 'string',
          enum: ['male', 'female', 'other'],
        },
        dateOfBirth: {
          type: 'string',
        },
      },
      required: ['firstName', 'lastName', 'idNumber', 'gender', 'dateOfBirth'],
    },
    document: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['PASSPORT', 'ID_CARD', 'RESIDENCE_PERMIT', 'DRIVERS_LICENSE'],
        },
      },
      required: ['number', 'country', 'type'],
    },
    images: {
      type: 'object',
      properties: {
        face: {
          type: 'string',
        },
        documentFront: {
          type: 'string',
        },
        documentBack: {
          type: 'string',
        },
      },
      required: ['face', 'documentFront', 'documentBack'],
    },
    address: {
      type: 'object',
      properties: {
        fullAddress: {
          type: 'string',
        },
      },
      required: ['fullAddress'],
    },
    vendor: {
      type: 'string',
    },
  },
  required: ['endUserId', 'callbackUrl', 'person', 'document', 'images', 'address', 'vendor'],
};
export class KycPlugin extends ApiPlugin {
  public static pluginType = 'kyc';
  kycResponseCallbackAction: string;
  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
    this.kycResponseCallbackAction = 'kycResponseCallback';
  }
  async validateContent<TValidationContext extends 'Request' | 'Response'>(
    schemaValidator: TValidators | undefined,
    transformedRequest: AnyRecord,
    validationContext: TValidationContext,
  ) {
    if (validationContext == 'Request') {
      return super.validateContent(
        new JsonSchemaValidator(kycIndividualRequestSchema),
        transformedRequest,
        validationContext,
      );
    } else {
      return super.validateContent(schemaValidator, transformedRequest, validationContext);
    }
  }
}
