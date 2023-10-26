import { RuleEngine } from '@app/components/organisms/DynamicElements/engines/rule-engine.abstract';

export class EngineManager {
  constructor(private readonly engines: RuleEngine[]) {}

  getEngine(engineName: string): RuleEngine | null {
    return this.engines.find(engine => engine.ENGINE_NAME === engineName) || null;
  }
}
