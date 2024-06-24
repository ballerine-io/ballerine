export type primitive = number | string | boolean;

export type BetweenParams = {
  min: number;
  max: number;
};

export type LastYearsParams = {
  years: number;
};

export type ConditionFn<T = primitive> = (value: primitive, param: T) => boolean;

export interface IConditionHelpers {
  [key: string]: ConditionFn<any>;
}
