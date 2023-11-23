import { TContext } from '../types';

export abstract class BaseContextTransformer {
  abstract name: string;
  type = 'context-transformer';

  abstract transform(context: TContext, options?: Record<PropertyKey, unknown>): Promise<any>;
}
