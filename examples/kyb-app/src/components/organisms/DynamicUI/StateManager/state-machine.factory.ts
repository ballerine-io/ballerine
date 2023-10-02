import { State } from '@app/components/organisms/DynamicUI/StateManager/types';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';

export const createStateMachine = (workflowId: string, definition: State) =>
  createWorkflow({
    runtimeId: workflowId,
    //@ts-nocheck
    definition: definition as any,
    definitionType: 'statechart-json',
  });
