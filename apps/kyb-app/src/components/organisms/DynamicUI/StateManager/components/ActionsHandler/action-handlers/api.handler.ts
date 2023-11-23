import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { EngineManager } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { EventEngine } from '@/components/organisms/DynamicUI/rule-engines/event.engine';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { Action, BaseActionParams, IRule } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import jmespath from 'jmespath';
import ky from 'ky';
import set from 'lodash/set';

export interface ApiActionParams extends BaseActionParams {
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
    // @ts-ignore
    new JsonSchemaRuleEngine(),
    new EventEngine(),
  ]);

  async run<TContext extends AnyObject>(
    context: TContext,
    action: Action<ApiActionParams>,
  ): Promise<TContext> {
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
    const updatedContext = this.updateContext(
      context,
      params,
      // @ts-ignore
      json,
    );

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
    if (!params.map?.toContext) return context;
    const requestPayload = jmespath.search(
      requestResult,
      // @ts-ignore
      params.map?.fromResponse,
    ) as AnyObject;

    const toContextMapSchema = params.map?.toContext
      ? (JSON.parse(params.map.toContext) as AnyObject)
      : {};

    for (const path in toContextMapSchema) {
      set(context, path, requestPayload[toContextMapSchema[path] as string]);
    }

    return { ...context };
  }

  private canInvoke(context: unknown, action: Action) {
    return action.dispatchOn.rules.every(rule => {
      const engine = this.engineManager.getEngine(rule.type);

      if (!engine) throw new Error(`Provided rule with engine ${rule.type} not supported`);

      //@ts-ignore
      return engine.validate(context, rule as IRule);
    });
  }
}
