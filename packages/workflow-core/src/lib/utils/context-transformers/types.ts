import { TContext } from '../types';
import { AnyRecord } from '@ballerine/common';
import { THelperMethod } from './helpers-transformer';

export type TTransformationLogic = string;
export type THelperFormatingLogic = Array<{
  source: string;
  target: string;
  method: THelperMethod;
  value?: string;
  options?: AnyRecord;
}>;
export abstract class BaseContextTransformer {
  abstract name: string;
  type = 'context-transformer';

  abstract transform(context: TContext, options?: unknown): Promise<any>;
}
