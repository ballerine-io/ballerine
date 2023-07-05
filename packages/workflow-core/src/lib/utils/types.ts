import { AnyRecord } from '@ballerine/common';
import { JsonSchemaValidator } from './context-validator/json-schema-validator';
import { JmespathTransformer } from './context-transformers/jmespath-transformer';
import { HelpersTransformer } from './context-transformers/helpers-transformer';

export type TContext = AnyRecord;
export type Transformer = JmespathTransformer | HelpersTransformer;
export type Transformers = Transformer[];
export type Validator = JsonSchemaValidator;
