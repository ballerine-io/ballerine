import { RuleEngine } from "./rule-engine.abstract";

export class EventEngine implements RuleEngine {
  public ENGINE_NAME = 'event';

  isActive() {
    return {isValid: true, errors: []};
  }
}
