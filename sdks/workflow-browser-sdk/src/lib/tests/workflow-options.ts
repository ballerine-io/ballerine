import { WorkflowBrowserSDKParams } from '../types';

// Specifies six states to have enough steps for USER_NEXT_STEP and USER_PREV_STEP tests.
export const workflowOptions: WorkflowBrowserSDKParams = {
  runtimeId: '',
  definitionType: 'statechart-json',
  definition: {
    id: 'test',
    initial: 'first',
    context: {
      documents: [],
      email: '',
    },
    states: {
      first: {
        on: {
          USER_NEXT_STEP: 'second',
        },
      },
      second: {
        on: {
          USER_PREV_STEP: 'first',
          USER_NEXT_STEP: 'third',
        },
      },
      third: {
        on: {
          USER_PREV_STEP: 'second',
          USER_NEXT_STEP: 'fourth',
        },
      },
      fourth: {
        on: {
          USER_PREV_STEP: 'third',
          USER_NEXT_STEP: 'fifth',
        },
      },
      fifth: {
        on: {
          USER_PREV_STEP: 'fourth',
          USER_NEXT_STEP: 'last',
        },
      },
      last: {
        type: 'final',
      },
    },
  },
  submitStates: [
    {
      state: 'fourth',
    },
  ],
  persistStates: [
    {
      state: 'third',
      persistence: 'LOCAL_STORAGE',
    },
  ],
};

// Allows testing both `HTTP_ERROR` and `ERROR` events.
export const errorWorkflow: WorkflowBrowserSDKParams = {
  runtimeId: '',
  backend: {
    baseUrl: 'http://bad-url.fail',
  },
  definitionType: 'statechart-json',
  definition: {
    id: 'test',
    initial: 'first',
    states: {
      first: {
        on: {
          USER_NEXT_STEP: 'last',
        },
      },
      last: {
        on: {
          USER_PREV_STEP: 'first',
        },
      },
    },
  },
  // Instead of type `final` so `USER_PREV_STEP` is not ignored
  submitStates: [
    {
      state: 'last',
    },
  ],
  // Use with `breakLocalStorage`
  persistStates: [
    {
      state: 'last',
      persistence: 'LOCAL_STORAGE',
    },
  ],
};

export const shortWorkflow: WorkflowBrowserSDKParams = {
  runtimeId: '',
  definitionType: 'statechart-json',
  definition: {
    id: 'test',
    initial: 'first',
    states: {
      first: {
        on: {
          USER_NEXT_STEP: 'last',
        },
      },
      last: {
        type: 'final',
      },
    },
  },
};
