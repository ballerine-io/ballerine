// import { ConditionType } from './enums';

export type primitive = number | string | boolean;

export type BetweenParams = {
  min: number;
  max: number;
};

export type LastYearsParams = {
  years: number;
};

// type IConditionBase = {
//   key: string;
//   type: ConditionType;
//   value?: any;
//   customFn?: (dataValue: any) => boolean;
//   conditions?: ICondition[]; // Nested conditions
//   operator?: 'and' | 'or'; // Operator for nested conditions
// };

// type BetweenCondition = IConditionBase & {
//   type: ConditionType.BETWEEN;
// } & IBetweenParams;

// type GeneralCondition = IConditionBase & {
//   key: string;
// };

// export type ICondition = BetweenCondition | GeneralCondition;

export type ConditionFn<T = primitive> = (value: primitive, param: T) => boolean;

export interface IConditionHelpers {
  [key: string]: ConditionFn<any>;
}
