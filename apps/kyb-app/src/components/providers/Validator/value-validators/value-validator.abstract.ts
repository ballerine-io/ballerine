export abstract class ValueValidator<TParams = object> {
  constructor(readonly params: TParams) {}

  abstract validate(value: unknown, errorMessage: string): void;
}
