import {
  InsertionStrategy,
  StrategyParams,
} from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/abstract.insertion-strategy';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';
import set from 'lodash/set';

export class ObjectInsertionStrategy implements InsertionStrategy {
  STRATEGY_TYPE = 'object';

  insert<TContext extends AnyObject>(context: TContext, params: StrategyParams): TContext {
    const { schema, destination } = params;

    const value = (get(context, destination) as AnyObject) || {};

    value.__strategyInserted = true;

    Object.entries(schema).forEach(([insertAt, pickFrom]) => {
      set(value, insertAt, get(context, pickFrom) as unknown);
    });

    set(context, destination, { ...value });

    return {
      ...context,
    };
  }

  remove<TContext extends AnyObject>(context: TContext, params: StrategyParams): TContext {
    const { schema, destination } = params;
    const value = (get(context, destination) as AnyObject) || {};

    if (!Object.keys(value).length) return context;

    Object.entries(schema).forEach(([insertAt]) => {
      set(value, insertAt, undefined);
    });

    value.__strategyInserted = undefined;

    set(context, destination, { ...value });

    return {
      ...context,
    };
  }
}
