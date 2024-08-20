import { ValueApplyValue } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/types';
import { AnyObject } from '@ballerine/ui';

export abstract class ValueApplySelector {
  abstract select<TContext>(value: ValueApplyValue, context: AnyObject): TContext;
}
