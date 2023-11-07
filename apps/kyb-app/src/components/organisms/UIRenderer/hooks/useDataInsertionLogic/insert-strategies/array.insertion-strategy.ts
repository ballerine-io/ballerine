import {
  InsertionStrategy,
  StrategyParams,
} from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/abstract.insertion-strategy';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';
import set from 'lodash/set';

export class ArrayInsertionStrategy implements InsertionStrategy {
  STRATEGY_TYPE = 'array';

  insert<TContext extends AnyObject>(context: TContext, params: StrategyParams): TContext {
    const { schema, destination } = params;

    const value = (get(context, destination) as Array<AnyObject>) || [];
    const isAlreadyInserted = value.find(item => item.__strategyInserted);

    if (isAlreadyInserted) return context;

    const insertionValue: AnyObject = {
      __strategyInserted: true,
    };

    Object.entries(schema).forEach(([insertAt, pickFrom]) => {
      set(insertionValue, insertAt, get(context, pickFrom) as unknown);
    });

    value.unshift(insertionValue);

    set(context, destination, [...value]);

    return {
      ...context,
    };
  }

  remove<TContext extends AnyObject>(context: TContext, params: StrategyParams): TContext {
    const { destination } = params;

    const value = (get(context, destination) as Array<AnyObject>) || [];

    if (
      !Array.isArray(value) ||
      !value.length ||
      !value.find((item: AnyObject) => item.__strategyInserted)
    )
      return context;

    set(
      context,
      destination,
      value.filter(item => !item.__strategyInserted),
    );

    return {
      ...context,
    };
  }

  static isValueInserted<TValue extends AnyObject>(value: TValue): boolean {
    if (typeof value === 'object' && value.__strategyInserted) return true;

    return false;
  }
}
