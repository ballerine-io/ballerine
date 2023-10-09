import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export type ErrorField = {
  field: string;
  message: string;
};

export interface RuleTestResult {
  isValid: boolean;
  errors?: ErrorField[];
}

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract test(
    context: unknown,
    rule: Rule,
    definition: UIElement<AnyObject>,
    uiState: UIState,
  ): RuleTestResult;
}
