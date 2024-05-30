import { StateMachine } from 'xstate';
import { ruleValidator, TDefintionRules } from './rule-validator';
import { AnyRecord } from '@ballerine/common';

type TTransitionEvent = string;

type TTransitionOption =
  | {
      target: string;
      cond?: TDefintionRules;
    }
  | string;
type TTransitionOptions = TTransitionOption[];
export const statesValidator = (
  states: StateMachine<any, any, any>['states'],
  exampleContext?: AnyRecord,
) => {
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
            validateTransitionOnEvent({
              stateNames,
              currentState,
              transition: transitionOption,
            });

            if (typeof transitionOption !== 'string' && transitionOption.cond) {
              ruleValidator(transitionOption.cond, exampleContext);
            }
          });

          continue;
        }

        validateTransitionOnEvent({
          stateNames,
          currentState,
          transition: transitionEvent as unknown as TTransitionEvent,
        });
      }
    }
  }
};

export const validateTransitionOnEvent = ({
  stateNames,
  currentState,
  transition,
}: {
  stateNames: string[];
  currentState: string;
  transition: TTransitionOption;
}) => {
  const targetState = typeof transition === 'string' ? transition : transition.target;

  if (!stateNames.includes(targetState)) {
    throw new Error(`Invalid transition from ${currentState} to ${targetState}`);
  }

  if (currentState === targetState) {
    throw new Error(`Recursive transition in state ${targetState}`);
  }
};
