import { IFieldContext } from '@/components/providers/Validator/types';

export abstract class ValueValidator<TParams = object> {
  abstract type: string;

  constructor(readonly params: TParams) {}

  abstract validate(value: unknown, fieldContext: IFieldContext): void;
}
