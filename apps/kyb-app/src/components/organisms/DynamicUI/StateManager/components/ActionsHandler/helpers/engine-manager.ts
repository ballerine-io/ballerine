import { RuleEngine } from '@/components/organisms/DynamicUI/rule-engines/rule-engine.abstract';

export class EngineManager {
  private enginesMap = new Map<string, RuleEngine>();

  constructor(private readonly engines: RuleEngine[]) {
    engines.forEach(engine => {
      this.enginesMap.set(engine.ENGINE_NAME, engine);
    });
  }

  getEngine(engineName: string): RuleEngine | null {
    return this.enginesMap.get(engineName) || null;
  }
}
