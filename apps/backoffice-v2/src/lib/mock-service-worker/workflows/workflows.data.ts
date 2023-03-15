import { endUsers } from '../end-users/end-users.data';

export const workflows = {
  __data: [
    {
      endUserId: endUsers.__data[0].id,
      id: 'clf5452ji000044wnul6bf8yr',
      version: '1.0.0',
      name: 'on-boarding',
      type: 'backoffice',
      state: {
        value: 'WELCOME',
        type: 'backoffice',
      },
      transitions: ['APPROVE', 'REJECT', 'RECOLLECT'],
      workflowContext: {
        machineContext: {
          documents: [],
        },
      },
      extensions: [],
      workflowDefinitionType: 'statechart-json',
      workflowDefinition: {
        id: 'on-boarding',
        initial: 'WELCOME',
        states: {
          WELCOME: {
            on: {
              APPROVE: 'APPROVE',
              REJECT: 'REJECT',
              RECOLLECT: 'RECOLLECT',
            },
          },
          APPROVE: {
            type: 'final',
          },
          REJECT: {
            type: 'final',
          },
          RECOLLECT: {
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
