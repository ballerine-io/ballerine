import {
  PickSelector,
  ValueApplyValue,
} from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/types';
import { ValueApplySelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/value-apply.selector.abstract';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export class ValueApplyPickSelector implements ValueApplySelector {
  select<TResult>(value: ValueApplyValue, context: AnyObject): TResult {
    if (!this.isPickSelector(value.selector)) throw new Error('Incorrect selector params.');

    return get(context, value.selector.pickDestination, value.selector.defaultValue) as TResult;
  }

  private isPickSelector(value: unknown): value is PickSelector {
    return (
      typeof value === 'object' &&
      typeof (value as AnyObject).pickDestination === 'string' &&
      (value as AnyObject).type === 'pick'
    );
  }
}
