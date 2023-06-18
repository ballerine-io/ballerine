import { run } from 'node-jq';
import { BaseContextTransformer, TContext, TTransformationLogic } from './types';

export class JQTransformer extends BaseContextTransformer {
  name = 'jq-transformer';
  transformationLogic: TTransformationLogic;

  constructor(transformationLogic: TTransformationLogic) {
    super();
    this.transformationLogic = transformationLogic
  }

  async transform(context: TContext, options: {}) {
    return await run(this.transformationLogic, context, options) as object;
  }
}
