import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export type ErrorField = {
  field: string;
  message: string;
}

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(
    context: unknown,
    rule: Rule,
    definition: UIElement<AnyObject>,
    uiState: UIState,
  ): { isValid: boolean, errors?: ErrorField[] };
}
