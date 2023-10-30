import { StateMachine } from 'xstate';
import { AnyRecord } from '@ballerine/common';

type TTransitionEvent = string;

type TTransitionOption = {
  target: string;
  cond?: {
    type: string;
    options: AnyRecord;
  };
};
type TTransitionOptions = Array<TTransitionOption>;
export const statesValidator = (states: StateMachine<any, any, any>['states']) => {
  const stateNames = Object.keys(states);
  for (const currentState of stateNames) {
    if (!states[currentState]) {
      throw new Error(`Invalid target state ${currentState} for transition`);
    }
    const transitions = states[currentState]!.on;

    if (transitions) {
      for (const event of Object.keys(transitions)) {
        const transitionEvent = transitions[event]!;
        if (Array.isArray(transitionEvent)) {
          (transitionEvent as unknown as TTransitionOptions).forEach(transitionOption => {
            validateTransitionOnEvent(stateNames, currentState, transitionOption.target);
            // validate transitionOption.cond
          });
        } else {
          validateTransitionOnEvent(
            stateNames,
            currentState,
            transitionEvent as unknown as TTransitionEvent,
          );
        }
      }
    }
  }
};

const validateTransitionOnEvent = (
  stateNames: Array<string>,
  currentState: string,
  targetState: string,
) => {
  if (!stateNames.includes(targetState)) {
    throw new Error(`Invalid transition from ${currentState} to ${targetState}`);
  }
  if (currentState === targetState) {
    throw new Error(`Recursive transition in state ${targetState}`);
  }
};
