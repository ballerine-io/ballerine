import { createWorkflow } from '@ballerine/workflow-core';
import { Prisma, UiDefinition } from '@prisma/client';

const EVENTS_BLACK_LIST = ['done', 'success', 'failed'];

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
    const snapshot = stateMachine.getSnapshot();

    if (!EVENTS_BLACK_LIST.includes(snapshot.value)) {
      stepsInOrder.push(snapshot.value);
    }

    // Check if NEXT event is available in current state
    if (snapshot.nextEvents.includes('NEXT')) {
      await stateMachine.sendEvent({ type: 'NEXT' });
    } else {
      break; // Exit if no NEXT event available
    }
  }

  return stepsInOrder.map((stepName, index) => ({ stateName: stepName, orderNumber: index + 1 }));
};
