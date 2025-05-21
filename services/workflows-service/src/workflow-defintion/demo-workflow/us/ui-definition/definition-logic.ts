export const definition = {
  definitionType: 'statechart-json',
  definition: {
    id: 'dynamic_collection_flow',
    predictableActionArguments: true,
    initial: 'company_information',
    context: {},
    states: {
      company_information: {
        on: {
          NEXT: 'business_address_information',
        },
      },
      business_address_information: {
        on: {
          NEXT: 'company_activity',
          PREVIOUS: 'company_information',
        },
      },
      company_activity: {
        on: {
          NEXT: 'bank_information',
          PREVIOUS: 'business_address_information',
        },
      },
      bank_information: {
        on: {
          NEXT: 'company_ownership',
          PREVIOUS: 'company_activity',
        },
      },
      company_ownership: {
        on: {
          NEXT: 'company_documents',
          PREVIOUS: 'bank_information',
        },
      },
      company_documents: {
        on: {
          NEXT: 'done',
          PREVIOUS: 'company_ownership',
        },
      },
      done: {
        on: {
          FAILED: 'failed',
          COMPLETED: 'completed',
        },
      },
      completed: {
        type: 'final',
      },
      failed: {
        type: 'final',
      },
    },
  },
  extensions: {
    apiPlugins: [],
  },
};
