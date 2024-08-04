import { ApiPlugin } from './external-plugin/api-plugin';
import { WebhookPlugin } from './external-plugin/webhook-plugin';
import { KycPlugin } from './external-plugin/kyc-plugin';
import { IterativePlugin } from './common-plugin/iterative-plugin';
import { TContext } from '../utils';
import { ChildWorkflowPlugin } from './common-plugin/child-workflow-plugin';
import { TransformerPlugin } from '../plugins/common-plugin/transformer-plugin';
import { RiskRulePlugin } from '@/lib/plugins/common-plugin/risk-rules-plugin';
import { WorkflowTokenPlugin } from '@/lib/plugins/common-plugin/workflow-token-plugin';

export type PluginAction = { workflowId: string; context: any; event: any; state: any };
export type InvokePluginAction = { context: TContext };

export type ExtensionRunOrder = 'pre' | 'post';
export interface WorkflowPlugin {
  when: ExtensionRunOrder;
  action: (options: PluginAction) => Promise<void>;
}

export interface StatePlugin extends WorkflowPlugin {
  /**
   * The actions key to inject an action function into.
   * E.g. { actions: { [plugin.name]: plugin.action  } }
   */
  name: string;

  /**
   * Should the plugin be executed in a blocking manner or async
   */
  isBlocking: boolean;
  /**
   * States already defined in the statechart
   */
  stateNames: string[];
}

export type StatePlugins = StatePlugin[];
export type HttpPlugin = ApiPlugin | WebhookPlugin | KycPlugin;
export type CommonPlugin =
  | IterativePlugin
  | TransformerPlugin
  | RiskRulePlugin
  | WorkflowTokenPlugin;
export type HttpPlugins = HttpPlugin[];
export type CommonPlugins = CommonPlugin[];
export type ChildPlugins = ChildWorkflowPlugin[];
export type ActionablePlugin = HttpPlugin;
export type ActionablePlugins = ActionablePlugin[];
