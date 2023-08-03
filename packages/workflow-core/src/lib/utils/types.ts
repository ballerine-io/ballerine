import { JsonSchemaValidator } from './context-validator/json-schema-validator';
import { AnyRecord } from '@ballerine/common';
import { JmespathTransformer } from './context-transformers/jmespath-transformer';

export type TContext = AnyRecord;
export type TTransformers = JmespathTransformer;
export type TValidators = JsonSchemaValidator;
