// import { ViewStateSchema } from '@app/common/providers/ViewStateProvider';

const intiialContext = {
  personalInformation: {},
  documents: {},
};

export const kybViewSchema = {
  initial: 'idle',
  context: intiialContext,
  states: {
    idle: {
      on: {
        NEXT: 'personalInformation',
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
    errorResolving: {},
    documents: {},
  },
};
