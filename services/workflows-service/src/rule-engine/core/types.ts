import { ConditionOperator, ConditionType } from './condition/enums';

export type primitive = number | string | boolean;

export type ConditionFn<T = primitive> = (
  dataValue: any,
  conditionValue?: T,
  condition?: ICondition,
) => boolean;

export interface IConditionHelpers {
  [key: string]: ConditionFn<any>;
}

export interface ICondition {
  key: string;
  type: ConditionType;
  value?: any;
  min?: number;
  max?: number;
  customFn?: (dataValue: any) => boolean;
  conditions?: ICondition[]; // Nested conditions
  operator?: ConditionOperator; // Operator for nested conditions
}

export type IRule = {
  id: string; // Unique identifier for the rule
  conditions: ICondition[];
  operator?: ConditionOperator; // Make operator optional with a default value of 'and'
};

export type RuleSet = IRule[];

export type IConditionResult = {
  key: string;
  value: any;
  passed: boolean;
  conditionResults?: { [key: string]: IConditionResult }; // Nested condition results
};

export type IRuleResult = {
  id: string;
  passed: boolean;
  conditionResults: { [key: string]: IConditionResult };
};

export type RuleSetResult = IRuleResult[];
