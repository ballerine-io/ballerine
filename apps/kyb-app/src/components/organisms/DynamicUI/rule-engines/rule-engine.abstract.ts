import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { Rule, UIElement, UIPage } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export type ErrorField = {
  fieldId: string;
  message: string;
  definitionName?: string;
  type: 'error' | 'warning';
  fieldDestination?: string;
};

export interface RuleTestResult {
  isValid: boolean;
  errors?: ErrorField[];
}

export abstract class RuleEngine {
  public abstract readonly ENGINE_NAME: string;

  abstract validate(
    context: unknown,
    rule: Rule,
    definition: UIElement<AnyObject>,
    uiState: UIState,
    uiPage: UIPage,
  ): RuleTestResult;

  abstract test(context: unknown, rule: Rule): boolean;
}
