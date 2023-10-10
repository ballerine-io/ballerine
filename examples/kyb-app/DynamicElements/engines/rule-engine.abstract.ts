import { IRule } from '@app/domains/collection-flow';
import { ErrorField } from '../../src/components/organisms/DynamicUI/rule-engines';

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(context: unknown, rule: IRule): { isValid: boolean; errors?: ErrorField[] };
}
