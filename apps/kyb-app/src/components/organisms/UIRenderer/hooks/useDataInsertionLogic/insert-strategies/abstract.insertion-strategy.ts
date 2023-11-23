import { InsertionSchema } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { AnyObject } from '@ballerine/ui';

export interface StrategyParams {
  schema: InsertionSchema;
  destination: string;
  bindingAnchorDestination: string;
}

export abstract class InsertionStrategy {
  abstract STRATEGY_TYPE: string;

  abstract insert<TContext extends AnyObject>(context: TContext, params: StrategyParams): TContext;

  abstract remove<TContext extends AnyObject>(context: TContext, params: StrategyParams): TContext;
}
