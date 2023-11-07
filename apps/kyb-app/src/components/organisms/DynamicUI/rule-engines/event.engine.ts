import { RuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';

export class EventEngine implements RuleEngine {
  public ENGINE_NAME = 'event';

  validate() {
    return { isValid: true, errors: [] };
  }

  test() {
    return true;
  }
}
