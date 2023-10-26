import { StateMachine } from 'xstate';

export const statesValidator = (states: StateMachine<any, any, any>['states']) => {
  const stateNames = Object.keys(states);
  for (const stateName of stateNames) {
    if (!states[stateName]) {
      throw new Error(`Invalid target state ${stateName} for transition`);
    }
    const transitions = states[stateName]!.on;
    if (transitions) {
      for (const event of Object.keys(transitions)) {
        const newVar = transitions[event]!;
        const target = newVar.target;
        if (!stateNames.includes(target)) {
          throw new Error(`Invalid transition from ${stateName} to ${target}`);
        }
        if (stateName === target) {
          throw new Error(`Recursive transition in state ${stateName}`);
        }
      }
    }
  }
};
