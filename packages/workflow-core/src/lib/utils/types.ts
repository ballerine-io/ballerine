import { AnyRecord } from '@ballerine/common';
import { JsonSchemaValidator } from './context-validator/json-schema-validator';
import { JmespathTransformer } from './context-transformers/jmespath-transformer';
import { HelpersTransformer } from './context-transformers/helpers-transformer';

export type TContext = AnyRecord;
export type TTransformer = JmespathTransformer | HelpersTransformer;
export type TTransformers = TTransformer[];
export type TValidators = JsonSchemaValidator;
// Will be a union in the future
export type Transformer = JmespathTransformer;
export type Validator = JsonSchemaValidator;
