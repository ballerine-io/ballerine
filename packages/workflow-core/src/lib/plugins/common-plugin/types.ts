import { TContext, Transformers } from "../../utils";
import { SerializableValidatableTransformer } from "../external-plugin";

export interface ISerializableCommonPluginParams
  extends Omit<IterativePluginParams, 'action' | 'iterateOn'> {
  iterateOn: Omit<SerializableValidatableTransformer, 'schema'>['transform'];
  response: SerializableValidatableTransformer;
  actionPluginName: string;

  invoke?(...args: Array<any>): any;
}

export interface IterativePluginParams {
  name: string;
  stateNames: Array<string>;
  iterateOn: Transformers;
  action: (context: TContext) => Promise<any>
  successAction?: string;
  errorAction?: string;
}
