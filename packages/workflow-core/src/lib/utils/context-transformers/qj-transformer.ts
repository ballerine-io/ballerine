import { run } from 'node-jq';
import { BaseContextTransformer, TContext } from './types';

export class JQTransformer extends BaseContextTransformer {
  name = 'jq-transformer';

  transform() {
    return run(this.transformationLogic, this.context, this.options);
  }
}
