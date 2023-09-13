import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';

export type UIElementType = 'text' | 'button';

export type BaseRuleValue = string;
export type EventRuleValue = {
  event: 'onClick' | 'onChange';
  uiElementName: string;
};

export interface BaseRule {
  engine: 'json-logic' | 'jmespath' | 'event';
}

export interface Rule extends BaseRule {
  value: string;
}

export interface EventRule extends BaseRule {
  value: EventRuleValue;
}

export interface Action<TParams = AnyObject> {
  type: string;
  invokeOn: (Rule | EventRule)[];
  params: TParams;
}

export interface UIElement<TElementParams> {
  name: string;
  type: UIElementType;
  activeOn?: Rule[];
  validationSchema?: RJSFSchema | null;
  required?: boolean;
  inputParams: TElementParams;
  valueDestination?: string;
}

interface UIElementProps<TElementParams> {
  definition: UIElement<TElementParams>;
  actions: Action[];
}

export type UIElementComponent<TElementParams = AnyObject> = React.ComponentType<
  UIElementProps<TElementParams>
>;
