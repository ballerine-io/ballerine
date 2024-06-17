export class InvalidEvalValueError extends Error {
  constructor(value: unknown) {
    super(`Invalid eval value: ${value}`);
  }
}
