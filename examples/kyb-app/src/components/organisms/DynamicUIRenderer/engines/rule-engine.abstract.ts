import { Rule } from '@app/components/organisms/DynamicUIRenderer/temp';

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(context: unknown, rule: Rule): boolean;
}
