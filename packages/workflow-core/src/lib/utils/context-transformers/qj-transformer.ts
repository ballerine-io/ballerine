import { run } from 'node-jq';
import { IContextTransformer, TContext, TTransformationLogic } from './types';

export class JQTransformer implements IContextTransformer {
  context: TContext;
  transformationLogic;
  options;

  constructor(context: TContext, transformationLogic: TTransformationLogic, options: {}) {
    this.context = context;
    this.transformationLogic = transformationLogic;
    this.options = options;
  }

  transform(): any {
    return run(this.transformationLogic, this.context, this.options);
  }
}
