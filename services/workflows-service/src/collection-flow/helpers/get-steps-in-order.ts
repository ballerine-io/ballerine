import { createWorkflow } from '@ballerine/workflow-core';
import { Prisma, UiDefinition } from '@prisma/client';

export const getStepsInOrder = async (uiDefinition: UiDefinition) => {
  if (!uiDefinition?.uiSchema) return [];

  const { uiSchema = {}, definition } = uiDefinition as Prisma.JsonObject;
  const { elements } = uiSchema as Prisma.JsonObject;

  if (!elements || !definition) return [];

  const stepsInOrder: string[] = [];

  const stateMachine = createWorkflow({
    runtimeId: '',
    definition: (definition as Prisma.JsonObject).definition as any,
    definitionType: 'statechart-json',
    extensions: {},
    workflowContext: {},
  });

  while (!stateMachine.getSnapshot().done) {
    stepsInOrder.push(stateMachine.getSnapshot().value);
    await stateMachine.sendEvent({ type: 'NEXT' });
  }

  return stepsInOrder.map((stepName, index) => ({ stateName: stepName, orderNumber: index + 1 }));
};
