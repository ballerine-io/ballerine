import { RuleEngine } from '@app/components/organisms/DynamicElements/engines/rule-engine.abstract';

export class EventEngine implements RuleEngine {
  public ENGINE_NAME = 'event';

  isActive(): boolean {
    return true;
  }
}
