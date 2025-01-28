import { jsonLogicEngineRunner } from './engines/json-logic/json-logic';
import { jsonSchemaEngineRunner } from './engines/json-schema/json-schema';
import { TRuleEngine, TRuleEngineRunner } from './types';

export const ruleEngineRepository: Record<TRuleEngine, TRuleEngineRunner> = {
  'json-logic': jsonLogicEngineRunner,
  'json-schema': jsonSchemaEngineRunner,
};

export const getRuleEngineRunner = <TRuleEngines = TRuleEngine>(engine: TRuleEngines) => {
  const runner = ruleEngineRepository[engine as keyof typeof ruleEngineRepository];

  if (!runner) {
    throw new Error(`Rule engine ${engine} not found`);
  }

  return runner;
};

export const addRuleEngineRunner = <TRuleEngines = TRuleEngine>(
  engine: TRuleEngines,
  runner: TRuleEngineRunner,
) => {
  ruleEngineRepository[engine as keyof typeof ruleEngineRepository] = runner;
};

export const removeRuleEngineRunner = <TRuleEngines = TRuleEngine>(engine: TRuleEngines) => {
  delete ruleEngineRepository[engine as keyof typeof ruleEngineRepository];
};
