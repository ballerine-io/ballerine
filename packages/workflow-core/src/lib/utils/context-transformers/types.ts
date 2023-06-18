import { TContext } from '../types';

export type TTransformationLogic = string;
export abstract class BaseContextTransformer {
  abstract name: string;
  type = 'context-transformer';

  abstract transform(
    transformationLogic: TTransformationLogic,
    context: TContext,
    options: {},
  ): Promise<any>;
}
