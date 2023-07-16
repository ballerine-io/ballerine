import { MachineConfig } from 'xstate';

const intiialContext = {
  personalInformation: {},
  documents: {},
};

export const stateSchema: MachineConfig<any, any, any> = {
  initial: 'idle',
  context: intiialContext,
  states: {
    idle: {
      on: {
        START: 'personalInformation',
        ERROR_RESOLVING: 'errorResolving',
      },
    },
    personalInformation: {
      on: {
        NEXT: {
          target: 'documents',
          actions: ['updateStateData'],
        },
      },
    },
  },
};
