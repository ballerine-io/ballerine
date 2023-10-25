import { RuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';

export class EventEngine implements RuleEngine {
  public ENGINE_NAME = 'event';

  test() {
    return { isValid: true, errors: [] };
  }
}
