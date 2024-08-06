export abstract class ValueValidator<TParams = object> {
  abstract type: string;

  constructor(readonly params: TParams) {}

  abstract validate(value: unknown, errorMessage: string): void;
}
