import { ConditionType } from './enums';

export type primitive = number | string | boolean;

export type IBetweenParams = {
  min: number;
  max: number;
};

export type IDateParams = {
  date: Date;
};

export type ConditionFn<T = primitive> = (value: primitive, param: T) => boolean;

type IConditionBase = {
  key: string;
  type: ConditionType;
  value?: any;
  customFn?: (dataValue: any) => boolean;
  conditions?: ICondition[]; // Nested conditions
  operator?: 'and' | 'or'; // Operator for nested conditions
};

type BetweenCondition = IConditionBase & {
  type: ConditionType.BETWEEN;
} & IBetweenParams;

type GeneralCondition = IConditionBase & {
  key: string;
};

export type ICondition = BetweenCondition | GeneralCondition;

export interface IConditionHelpers {
  [key: string]: ConditionFn<any>;
}
