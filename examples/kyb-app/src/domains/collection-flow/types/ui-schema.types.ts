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

export interface IRule extends BaseRule {
  value: string;
  persistStateRule?: boolean;
}

export interface EventRule extends BaseRule {
  value: EventRuleValue;
}

export interface Action<TParams = AnyObject> {
  type: string;
  dispatchOn: {
    uiEvents: { event: string; uiElementName: string }[];
    rules: (IRule | EventRule)[];
  };
  params: TParams;
}

export interface UIElement<TElementParams> {
  name: string;
  type: UIElementType;
  availableOn?: IRule[];
  visibleOn?: IRule[];
  required?: boolean;
  options: TElementParams;
  valueDestination?: string;
  elements?: UIElement<AnyObject>[];
}
