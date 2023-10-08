import { Rule } from '@app/domains/collection-flow';

export type ErrorField = {
  field: string;
  message: string;
}

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(context: unknown, rule: Rule): { isValid: boolean, errors?: ErrorField[] };
}
