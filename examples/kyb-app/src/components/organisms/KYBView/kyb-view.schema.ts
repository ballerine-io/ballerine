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
        revision: 'revision',
      },
    },
    personalInformation: {
      on: {
        SAVE_DATA: {
          actions: ['updateStateData'],
        },
        NEXT: {
          target: 'documents',
        },
      },
    },
    documents: {
      on: {
        NEXT: {
          target: 'final',
        },
      },
    },
    revision: {
      on: {
        NEXT: {
          target: 'final',
        },
      },
    },
    final: {
      type: 'final' as const,
    },
  },
};
