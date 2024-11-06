import { createMachine, interpret } from 'xstate';

export interface IGetOrderedStepsParams {
  // The event to send to the machine to move to the next step
  eventName?: string;

  // When one of these states is reached, the loop will end
  finalStates?: string[];
}

export const getOrderedSteps = (
  definition: Record<string, any>,
  params: IGetOrderedStepsParams = {},
) => {
  const { eventName = 'NEXT', finalStates = [] } = params;

  const steps: string[] = [definition.initial];

  const machine = createMachine({
    initial: definition.initial,
    context: {},
    states: definition.states,
  });

  const service = interpret(machine).start();

  while (service.getSnapshot().can({ type: eventName })) {
    service.send({ type: eventName });
    const stateValue = service.getSnapshot().value as string;

    if (finalStates.includes(stateValue)) {
      break;
    }

    steps.push(stateValue);
  }

  return steps;
};
