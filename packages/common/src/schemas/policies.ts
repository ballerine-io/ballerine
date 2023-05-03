/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { jsonLogicSchema } from './json-logic';
import { rootSchema } from './root';
import { JSONSchema7 } from 'json-schema';

const decisionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    dataDepenency: { type: 'array', items: { type: 'string' } },
    childPolicy: { type: 'object', properties: { id: { type: 'string' } } },
    value: { type: 'string' },
    metadata: { type: 'object' },
  },
};

const decisionsSchema: JSONSchema7 = {
  type: 'object',
  propertyNames: {
    type: 'string',
  },
  additionalProperties: decisionSchema,
};

const ruleSetsFiltersSchema: JSONSchema7 = {
  type: 'object',
  propertyNames: {
    type: 'string',
  },
  additionalProperties: jsonLogicSchema,
};

const ruleSetsRulesSchema: JSONSchema7 = {
  type: 'object',
  propertyNames: {
    type: 'string',
  },
  additionalProperties: jsonLogicSchema,
};

export const policySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    version: { type: 'number' }, // version of the policy
    data: {
      type: 'object',
      properties: {
        endUser: rootSchema.definitions!.EndUser!,
        business: rootSchema.definitions!.Business!,
      },
    },
    decisions: decisionsSchema,
    rulesSets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          filter: {
            type: 'array',
            items: ruleSetsFiltersSchema,
          },
          rules: {
            type: 'array',
            items: ruleSetsRulesSchema,
          },
          result: {
            type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
          },
        },
        required: ['filter', 'rules', 'result'],
      },
    },
  },
};
