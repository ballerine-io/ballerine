import { TTransformationLogic } from './types';
import { TContext } from '../types';
import { search } from 'jmespath';
import { BaseContextTransformer } from './base-context-transformer';

export class JmespathTransformer extends BaseContextTransformer {
  name = 'jmespath-transformer';
  mapping: TTransformationLogic;

  constructor(mapping: TTransformationLogic) {
    super();
    this.mapping = mapping;
  }

  /**
   *
   * @param context
   * @param _options - currently not in use`
   */
  async transform(context: TContext, _options = {}) {
    const response = await search(context, this.mapping);

    return response;
  }
}
