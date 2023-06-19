import { JQTransformer } from './context-transformers/qj-transformer';
import { JsonSchemaValidator } from './context-validator/json-schema-validator';
import { AnyRecord } from '@ballerine/common';

export type TContext = AnyRecord;

export type TTransformers = JQTransformer;
export type TValidators = JsonSchemaValidator;
