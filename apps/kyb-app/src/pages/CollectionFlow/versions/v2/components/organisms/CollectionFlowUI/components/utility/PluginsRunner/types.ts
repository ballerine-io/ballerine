import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { AnyObject, IRule, TElementEvent } from '@ballerine/ui';

export interface IPluginCommonParams {
  debounceTime: number;
}

export interface IPluginRunOnDefinition<TEvents extends TElementEvent> {
  type: TEvents;
  elementId?: string;
  rules?: IRule[];
}

export interface IPlugin<
  TPluginParams extends object = object,
  TEvents extends TElementEvent = TElementEvent,
> {
  name: string;
  runOn: Array<IPluginRunOnDefinition<TEvents>>;
  params: TPluginParams;
  commonParams?: IPluginCommonParams;
}

export type TPluginRunner<TPluginParams extends object = object, TContext = AnyObject> = (
  context: TContext,
  app: { api: StateMachineAPI },
  pluginParams: TPluginParams,
) => Promise<TContext>;
