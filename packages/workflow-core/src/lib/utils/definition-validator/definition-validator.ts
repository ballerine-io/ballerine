import { StateMachine } from 'xstate';

import { WorkflowExtensions } from '../../types';
import { statesValidator, validateTransitionOnEvent } from './states-validator';
import { extensionsValidator } from './extensions-validator';
import { AnyRecord } from '@ballerine/common';

export const definitionValidator = (
  definition: {
    states?: StateMachine<any, any, any>['states'];
    initial?: string;
    initialContext?: AnyRecord;
  },
  extensions?: WorkflowExtensions,
  exampleContext?: AnyRecord,
) => {
  if (!definition.states) return;

  if (definition.initial) {
    validateTransitionOnEvent({
      stateNames: Object.keys(definition.states),
      currentState: 'NULL_AS_UNINITIATED_STATE',
      targetState: definition.initial,
    });
  }

  statesValidator(definition.states, exampleContext);

  if (extensions) {
    extensionsValidator(extensions, definition.states);
  }
};
