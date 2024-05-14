import { InlineRule } from './types';

export class NotFoundEvaluationError extends Error {
  inlineRule: string;

  constructor(message: string, inlineRule: InlineRule) {
    super(message);
    this.inlineRule = JSON.stringify(inlineRule);
  }
}
