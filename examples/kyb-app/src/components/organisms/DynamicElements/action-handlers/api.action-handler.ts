import { ActionHandler } from '@app/components/organisms/DynamicElements/action-handlers/action-handler.abstract';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicElements/engines/json-logic.rule-engine';
import { EngineManager } from '@app/components/organisms/DynamicElements/helpers/engine-manager';
import { AnyObject } from '@ballerine/ui';
import ky from 'ky';
import jmespath from 'jmespath';
import set from 'lodash/set';
import { EventEngine } from '@app/components/organisms/DynamicElements/engines/event.engine';
import { Action, Rule } from '@app/domains/collection-flow';

export interface ApiActionParams {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  type: 'json' | 'form-data';
  headers?: Headers;
  map?: {
    toBody?: string;
    fromResponse?: string;
    toContext?: string;
  };
}

export class ApiActionHandler implements ActionHandler {
  public readonly ACTION_TYPE = 'api';
  private readonly engineManager = new EngineManager([
    new JsonLogicRuleEngine(),
    new EventEngine(),
  ]);

  async run<TContext>(context: TContext, action: Action<ApiActionParams>): Promise<TContext> {
    const isCanInvoke = this.canInvoke(context, action);

    if (!isCanInvoke) return Promise.resolve(context);

    const { params } = action;

    const requestResult = await ky[params.method](params.url, {
      ...(params.method === 'get'
        ? {}
        : { [params.type === 'json' ? 'json' : 'body']: this.getRequestPayload(context, params) }),
      headers: params.headers,
    });

    const json = await requestResult.json();
    const updatedContext = this.updateContext(context, params, json);

    return updatedContext;
  }

  private getRequestPayload<TContext extends AnyObject>(
    context: TContext,
    actionParams: ApiActionParams,
  ): AnyObject | undefined {
    if (actionParams.type !== 'json') return undefined;
    if (!actionParams.map) return undefined;

    const { toBody = '' } = actionParams.map;

    const result = jmespath.search(context, toBody) as AnyObject;

    return result;
  }

  private updateContext<TContext extends AnyObject>(
    context: TContext,
    params: ApiActionParams,
    requestResult: AnyObject = {},
  ): TContext {
    if (!params.map.toContext) return context;
    const requestPayload = jmespath.search(requestResult, params.map.fromResponse) as AnyObject;

    const toContextMapSchema = params.map.toContext
      ? (JSON.parse(params.map.toContext) as AnyObject)
      : {};

    for (const path in toContextMapSchema) {
      set(context, path, requestPayload[toContextMapSchema[path] as string]);
    }

    return { ...context };
  }

  private canInvoke(context: unknown, action: Action): boolean {
    return action.invokeOn.every(rule => {
      const engine = this.engineManager.getEngine(rule.engine);

      if (!engine) throw new Error(`Provided rule with engine ${rule.engine} not supported`);

      return engine.isActive(context, rule as Rule);
    });
  }
}
