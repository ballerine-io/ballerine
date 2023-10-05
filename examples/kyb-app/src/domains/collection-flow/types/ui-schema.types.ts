import { AnyObject } from '@ballerine/ui';

export type UIElementType = 'text' | 'button';

export type BaseRuleValue = string;
export type EventRuleValue = {
  event: 'onClick' | 'onChange';
  uiElementName: string;
};

export interface BaseRule {
  type: 'json-logic' | 'jmespath' | 'event';
}

export interface Rule extends BaseRule {
  value: string;
}

export interface EventRule extends BaseRule {
  value: EventRuleValue;
}

export interface Action<TParams = AnyObject> {
  type: string;
  dispatchOn: {
    uiEvents: { event: string; uiElementName: string }[];
    rules: (Rule | EventRule)[];
  };
  params: TParams;
}

export interface UIElement<TElementParams> {
  name: string;
  type: UIElementType;
  availableOn?: Rule[];
  visibleOn?: Rule[];
  required?: boolean;
  options: TElementParams;
  valueDestination?: string;
  elements?: UIElement<AnyObject>[];
}
