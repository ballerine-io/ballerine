import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { RuleEngine } from '@app/components/organisms/DynamicUI/rule-engines';
import {
  InsertionStrategy,
  StrategyParams,
} from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/abstract.insertion-strategy';
import { InsertionParams } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
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
}
