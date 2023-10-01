import { Rule } from '@app/components/organisms/DynamicElements/types';

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(context: unknown, rule: Rule): boolean;
}
