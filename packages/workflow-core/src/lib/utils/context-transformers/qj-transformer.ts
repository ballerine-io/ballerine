import { run } from 'node-jq';
import { BaseContextTransformer, TContext, TTransformationLogic } from './types';

export class JQTransformer extends BaseContextTransformer {
  name = 'jq-transformer';

  transform(transformationLogic: TTransformationLogic, context: TContext, options: {}) {
    return run(transformationLogic, context, options);
  }
}
