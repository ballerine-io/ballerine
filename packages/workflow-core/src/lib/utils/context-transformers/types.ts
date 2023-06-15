import { TContext } from '../types';

export type TTransformationLogic = string;
export interface IContextTransformer {
  context: TContext;
  transformationLogic: TTransformationLogic;
  options: {};
  transform(): Promise<any>;
}
