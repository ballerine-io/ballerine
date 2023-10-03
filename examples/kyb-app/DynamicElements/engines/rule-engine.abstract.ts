import { Rule } from '@app/domains/collection-flow';

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(context: unknown, rule: Rule): boolean;
}
