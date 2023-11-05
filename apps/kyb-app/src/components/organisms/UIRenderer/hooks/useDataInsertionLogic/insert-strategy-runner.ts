import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { RuleEngine } from '@app/components/organisms/DynamicUI/rule-engines';
import {
  InsertionStrategy,
  StrategyParams,
} from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/abstract.insertion-strategy';
import { InsertionParams } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { Rule } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export class InsertStrategyRunner {
  private engineManager: EngineManager;
  private strategiesMap: Map<string, InsertionStrategy> = new Map();

  constructor(readonly engines: RuleEngine[], readonly insertionStrategies: InsertionStrategy[]) {
    this.engineManager = new EngineManager(engines);

    insertionStrategies.forEach(strategy =>
      this.strategiesMap.set(strategy.STRATEGY_TYPE, strategy),
    );
  }

  run<TContext extends AnyObject>(context: TContext, params: InsertionParams): TContext {
    const isCanInsert = this.executeRules(context, params.insertWhen);
    const isCanRemove = this.executeRules(context, params.removeWhen);

    if (!isCanInsert && !isCanRemove) return context;

    if (isCanInsert) return this.runInsertion(context, params);
    if (isCanRemove) return this.runRemoval(context, params);

    return context;
  }

  runInsertion<TContext extends AnyObject>(context: TContext, params: InsertionParams): TContext {
    const strategy = this.strategiesMap.get(params.insertionStrategy);

    if (!strategy) {
      console.warn(`Insertion strategy with type ${params.insertionStrategy} not found.`);
      return context;
    }

    const insertionResult = strategy.insert(context, this.getStrategyParams(params));

    return insertionResult;
  }

  runRemoval<TContext extends AnyObject>(context: TContext, params: InsertionParams): TContext {
    const strategy = this.strategiesMap.get(params.insertionStrategy);

    if (!strategy) {
      console.warn(`Insertion strategy with type ${params.insertionStrategy} not found.`);
      return context;
    }

    const removalResult = strategy.remove(context, this.getStrategyParams(params));

    return removalResult;
  }

  private getStrategyParams(inputParams: InsertionParams): StrategyParams {
    const params: StrategyParams = {
      schema: inputParams.schema,
      destination: inputParams.destination,
    };

    return params;
  }

  private executeRules(context: unknown, rules: Rule[]) {
    if (!rules.length) return true;

    return rules.every(rule => {
      const ruleEngine = this.engineManager.getEngine(rule.type);

      if (!ruleEngine) {
        console.warn(`Rule engine with type: ${rule.type} not found.`);
        return false;
      }

      return ruleEngine.test(context, rule);
    });
  }
}
