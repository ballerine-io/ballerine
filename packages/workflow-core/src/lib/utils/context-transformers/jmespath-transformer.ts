import { BaseContextTransformer, TTransformationLogic } from './types';
import { TContext } from '../types';
import { search } from 'jmespath';
export class JmespathTransformer extends BaseContextTransformer {
  name = 'jmespath-transformer';
  mapping: TTransformationLogic;

  constructor(mapping: TTransformationLogic) {
    super();
    this.mapping = mapping;
  }

  async transform(context: TContext, options: {}) {
    const response = await search(context, this.mapping);

    return response;
  }
}
