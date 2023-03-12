export const workflows = {
  __data: [
    {
      id: 'clf5452ji000044wnul6bf8yr',
      state: 'WELCOME',
      name: 'kyc',
      context: {
        documents: [],
      },
      backend: {
        baseUrl: 'http://localhost:3000/api',
        endpoints: {
          persist: {
            endpoint: '/workflows/:workflowId',
            method: 'PUT',
          },
        },
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGV5MG4zd2UwMDAwNDRjcXppYTl0N2RoIiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTY3ODE3OTM4MywiZXhwIjoxNjc4MzUyMTgzfQ.U85Y-WI09b3h-RYmJyX9ulS4yGyFY7BxZENNKqGbvzI',
        },
      },
      persistStates: [
        {
          state: 'DOCUMENT_SELECTION',
          persistence: 'BACKEND',
        },
        {
          state: 'FINAL',
          persistence: 'BACKEND',
        },
      ],
      submitStates: [
        {
          state: 'DOCUMENT_PHOTO',
        },
      ],
      workflowDefinitionType: 'statechart-json',
      workflowDefinition: {
        id: 'kyc',
        predictableActionArguments: true,
        initial: 'WELCOME',
        schema: {
          events: {},
          context: {
            documents: [],
          },
        },
        states: {
          WELCOME: {
            on: {
              USER_NEXT_STEP: 'DOCUMENT_SELECTION',
            },
          },
          DOCUMENT_SELECTION: {
            on: {
              USER_PREV_STEP: 'WELCOME',
              USER_NEXT_STEP: 'DOCUMENT_PHOTO',
            },
          },
          DOCUMENT_PHOTO: {
            on: {
              USER_PREV_STEP: 'DOCUMENT_SELECTION',
              USER_NEXT_STEP: 'FINAL',
            },
          },
          FINAL: {
            type: 'final',
          },
        },
      },
    },
  ],
  findAll() {
    return this.__data;
  },
  findById(id: string) {
    return this.findAll().find(workflow => workflow.id === id);
  },
  updateById(id: string, data: Partial<any>) {
    this.__data = this.findAll().map(workflow => {
      if (workflow.id !== id) return workflow;

      return {
        ...workflow,
        ...data,
      };
    });
  },
};
