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

  if (!definition?.states || !definition?.initial) {
    throw new Error('Invalid state machine definition');
  }

  const steps: string[] = [definition.initial];
  let currentState = definition.initial;

  while (currentState) {
    const stateConfig = definition.states[currentState];

    if (!stateConfig) {
      throw new Error(`Invalid state: ${currentState}`);
    }

    // Check if state has transition for the event
    const transition = stateConfig?.on?.[eventName];

    if (!transition) {
      break;
    }

    // Get next state from transition
    const nextState = typeof transition === 'string' ? transition : transition.target;

    if (!nextState || stateConfig.type === 'final' || finalStates.includes(nextState)) {
      break;
    }

    steps.push(nextState);
    currentState = nextState;
  }

  return steps;
};
