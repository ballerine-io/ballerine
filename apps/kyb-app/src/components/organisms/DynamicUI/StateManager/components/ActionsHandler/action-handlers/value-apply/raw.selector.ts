import {
  RawSelector,
  ValueApplyValue,
} from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/types';
import { ValueApplySelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/value-apply.selector.abstract';
import { isObject } from '@ballerine/common';

export class ValueApplyRawSelector implements ValueApplySelector {
  select<TResult>(value: ValueApplyValue): TResult {
    if (!this.isRawSelector(value.selector)) throw new Error('Incorrect selector params.');

    return value.selector.value as TResult;
  }

  private isRawSelector(value: unknown): value is RawSelector {
    return isObject(value) && value.type === 'raw';
  }
}
