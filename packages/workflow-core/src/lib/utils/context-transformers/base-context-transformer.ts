import { TContext } from '../types';

export abstract class BaseContextTransformer {
  abstract name: string;
  type = 'context-transformer';

  abstract transform(context: TContext, options: {}): Promise<any>;
}
