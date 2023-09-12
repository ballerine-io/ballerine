import { Prisma, PrismaClient } from '@prisma/client';

export const kybWithDynamicExternalRequestWorkflowExample = {
  context: 'collection_flow',
  uiSchema: {
    uiElements: [
      {
        name: 'fetchDataButton',
        type: 'button',
        inputParams: {
          label: 'Fetch Data',
        },
      },
      {
        name: 'firstName',
        type: 'text',
        activeOn: [],
        required: true,
        validationSchema: {
          type: 'string',
        },
        inputParams: {
          placeholder: 'John',
          title: 'First Name',
        },
      },
      {
        name: 'lastName',
        type: 'text',
        // where to take the information from and where to put it
        activeOn: [
          {
            engine: 'json-logic',
            value: `{
        "if": [
          { "var": "firstName" },
          true,
          false
        ]
      }`,
          },
        ],
        inputParams: {
          placeholder: 'Doe',
          title: 'Last Name',
        },
      },
      {
        name: 'submit',
        type: 'button',
        inputParams: {
          label: 'Submit',
        },
        activeOn: [
          {
            engine: 'json-logic',
            value: `{
        "and": [
          {"var": "firstName"},
          {"var": "lastName"}
        ]
      }`,
          },
        ],
      },
    ],
    actions: [
      {
        type: 'api',
        invokeOn: [
          {
            engine: 'event',
            value: { event: 'onClick', uiElementName: 'submit' },
          },
        ],
        params: {
          url: 'http://localhost:3000/data_ta',
          method: 'post',
          type: 'json', // could be formData when Files present?
          map: {
            toBody: `{"firstName": "firstName", "lastName": "lastName"}`,
            persistToContext: `{result1: firstName, lastName: lastName}`,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'bearer secret',
          },
        },
      },
      {
        type: 'api',
        invokeOn: [
          {
            engine: 'event',
            value: { event: 'onClick', uiElementName: 'fetchDataButton' },
          },
        ],
        params: {
          url: 'http://localhost:3000/api/external/workflows/test-workflow-risk-id-1',
          method: 'get',
          type: 'json',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'bearer secret',
          },
          map: {
            fromResponse: '@',
          },
        },
      },
    ],
  },
  workflowDefinitionId: 'risk-score-improvement-dev',
  projectId: 'project-1',
} as const satisfies Prisma.UiDefinitionUncheckedCreateInput;
export const generateDynamicUiTest = async (prismaClient: PrismaClient) => {
  return await prismaClient.uiDefinition.create({
    data: kybWithDynamicExternalRequestWorkflowExample,
  });
};
