// import { Prisma, PrismaClient } from '@prisma/client';
// import {
//   documentPersonalInformationCell
// } from "../../../src/ui-definition/utils/document-personal-information";
//
// export const kybWithDynamicExternalRequestWorkflowExample = {
//   context: 'back_office',
//   uiSchema: {
//     elements: [
//       {
//         page: {
//           elements: [
//             {
//               case: {
//                 name: 'KycCase',
//                 elements: [
//                   documentPersonalInformationCell()
//                 ]
//               }
//             }
//           ]
//         }
//       },
//     case: [
//       {
//         name: 'fetchDataButton',
//         type: 'button',
//         inputParams: {
//           label: 'Fetch Data',
//         },
//       },
//       {
//         name: 'email',
//         type: 'text',
//         activeOn: [],
//         required: true,
//         validationSchema: {
//           type: 'string',
//         },
//         inputParams: {
//           placeholder: 'John',
//           title: 'Email',
//         },
//       },
//       {
//         name: 'companyName',
//         type: 'text',
//         // where to take the information from and where to put it
//         activeOn: [
//           {
//             engine: 'json-logic',
//             value: `{
//         "if": [
//           { "var": "email" },
//           true,
//           false
//         ]
//       }`,
//           },
//         ],
//         inputParams: {
//           placeholder: 'Ballerine',
//           title: 'Company Name',
//         },
//       },
//       {
//         name: 'submit',
//         type: 'button',
//         inputParams: {
//           label: 'Submit',
//         },
//         activeOn: [
//           {
//             engine: 'json-logic',
//             value: `{
//         "and": [
//           {"var": "email"},
//           {"var": "companyName"}
//         ]
//       }`,
//           },
//         ],
//       },
//     ],
//     actions: [
//       {
//         type: 'api',
//         invokeOn: [
//           {
//             engine: 'event',
//             value: { event: 'onClick', uiElementName: 'submit' },
//           },
//         ],
//         params: {
//           url: 'http://localhost:3000/data_ta',
//           method: 'post',
//           type: 'json', // could be formData when Files present?
//           map: {
//             toBody: `{data: {personalEmail: context.data.entity.email, personalCompanyInfo: companyName}}`,
//           },
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'bearer secret',
//           },
//         },
//       },
//       {
//         type: 'api',
//         invokeOn: [
//           {
//             engine: 'event',
//             value: { event: 'onClick', uiElementName: 'fetchDataButton' },
//           },
//         ],
//         params: {
//           url: 'http://localhost:3000/api/v1/external/workflows/test-workflow-risk-id-1?resultDestination={context.data.entity}',
//           method: 'get',
//           type: 'json',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'bearer secret',
//           },
//           map: {
//             fromResponse: 'merge(@, {context.entity.data.companyName: response.data.companyName})',
//             toContext: `{"email": "email", "companyName": "companyName"}`,
//           },
//         },
//       },
//     ],
//   },
//   workflowDefinitionId: 'risk-score-improvement-dev', // how the context looks
//   projectId: 'project-1',
// } as const satisfies Prisma.UiDefinitionUncheckedCreateInput;
// export const generateDynamicUiTest = async (prismaClient: PrismaClient) => {
//   return await prismaClient.uiDefinition.create({
//     data: kybWithDynamicExternalRequestWorkflowExample,
//   });
// };
