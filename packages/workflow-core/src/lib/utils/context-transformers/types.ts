import { TContext } from '../types';

export type TTransformationLogic = string;
export abstract class BaseContextTransformer {
  abstract name: string;
  type = 'context-transformer';
  context: TContext;
  transformationLogic: TTransformationLogic;
  options: {};

  protected constructor(context: TContext, transformationLogic: TTransformationLogic, options: {}) {
    this.context = context;
    this.transformationLogic = transformationLogic;
    this.options = options;
  }

  abstract transform(): Promise<any>;
}
