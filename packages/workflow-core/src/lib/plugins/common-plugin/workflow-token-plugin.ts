import { TContext } from '../../utils';
import { WorkflowTokenPluginParams } from './types';
import { logger } from '../../logger';

export class WorkflowTokenPlugin {
  public static pluginType = 'risk-rules';
  name: WorkflowTokenPluginParams['name'];
  uiDefinitionId: WorkflowTokenPluginParams['uiDefinitionId'];
  stateNames: WorkflowTokenPluginParams['stateNames'];
  action: WorkflowTokenPluginParams['action'];
  successAction: WorkflowTokenPluginParams['successAction'];
  errorAction: WorkflowTokenPluginParams['errorAction'];
  persistResponseDestination: string;

  constructor(pluginParams: WorkflowTokenPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.uiDefinitionId = pluginParams.uiDefinitionId;
    this.action = pluginParams.action;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
    this.persistResponseDestination = 'metadata';
  }

  async invoke(context: TContext) {
    const workflowRuntimeId = context.workflowRuntimeId as string;

    const uiDefinitionCreationArgs = {
      workflowRuntimeId: workflowRuntimeId,
      uiDefinitionId: this.uiDefinitionId,
    };

    try {
      const payloadToPersist = await this.action(uiDefinitionCreationArgs);

      return {
        response: payloadToPersist,
        callbackAction: this.successAction,
      } as const;
    } catch (error) {
      logger.error(`Rules Plugin Failed`, {
        name: this.name,
        ...uiDefinitionCreationArgs,
      });

      return {
        callbackAction: this.errorAction,
        error: error,
      } as const;
    }
  }
}
