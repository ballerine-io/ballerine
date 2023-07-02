import { AnyRecord } from '@ballerine/common';
import { JsonSchemaValidator } from './context-validator/json-schema-validator';
import { JmespathTransformer } from './context-transformers/jmespath-transformer';

export type TContext = AnyRecord;
// Will be a union in the future
export type Transformer = JmespathTransformer;
export type Validator = JsonSchemaValidator;
