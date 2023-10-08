import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export abstract class RuleEngine {
  public readonly ENGINE_NAME: string;

  abstract isActive(
    context: unknown,
    rule: Rule,
    definition: UIElement<AnyObject>,
    uiState: UIState,
  ): boolean;
}
