import { State } from '@/components/organisms/DynamicUI/StateManager/types';
import { AnyObject } from '@ballerine/ui';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';

export const createStateMachine = (
  workflowId: string,
  definition: State,
  definitionType: string,
  extensions: AnyObject,
  workflowContext?: AnyObject,
) =>
  createWorkflow({
    runtimeId: workflowId,
    //@ts-nocheck
    definition: definition as any,
    definitionType: 'statechart-json',
    extensions: extensions,
    workflowContext: workflowContext,
  });
