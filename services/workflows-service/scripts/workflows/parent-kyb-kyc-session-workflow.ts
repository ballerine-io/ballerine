import { PrismaClient } from '@prisma/client';
import { kycEmailSessionDefinition } from './kyc-email-process-example';
import {
  defaultPersonalInformationData,
  personalInformationSchema,
  personalInformationUISchema,
} from './schemas/personal-information.schema';
import {
  companyInformationSchema,
  companyInformationUISchema,
  defaultCompanyInformationData,
} from './schemas/company-information.schema';
import {
  defaultHeadquartersData,
  headquartersSchema,
  headquartersUISchema,
} from './schemas/headquarters.schema';
import { companyActivitySchema, companyActivityUISchema } from './schemas/company-activity.schema';
import {
  bankInformationSchema,
  bankInformationUISchema,
  defaultBankInformationData,
} from './schemas/bank-information.schema';
import {
  defaultShareholdersData,
  shareholdersSchema,
  shareholdersUISchema,
} from './schemas/shareholders.schema';
import {
  companyDocumentsSchema,
  companyDocumentsUISchema,
  defaultCompanyDocumentsData,
} from './schemas/company-documents.schema';
import { env } from '../../src/env';

import { defaultContextSchema, StateTag } from '@ballerine/common';

export const parentKybWithSessionWorkflowDefinition = {
  id: 'kyb_parent_kyc_session_example',
  name: 'kyb_parent_kyc_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_parent_kyc_session_example_v1',
    predictableActionArguments: true,
    initial: 'data_collection',
    context: {
      documents: [],
    },
    states: {
      data_collection: {
        on: {
          start: 'run_ubos',
        },
        metadata: {
          uiSettings: {
            multiForm: {
              documents: [
                {
                  name: 'bankStatement',
                  type: 'file',
                },
                {
                  name: 'companyStructure',
                  type: 'file',
                },
                {
                  name: 'registrationCertificate',
                  type: 'file',
                },
                {
                  name: 'addressProof',
                  type: 'file',
                },
              ],
              steps: [
                {
                  title: 'Personal information',
                  description: 'Please provide your personal information',
                  formSchema: personalInformationSchema,
                  uiSchema: personalInformationUISchema,
                  defaultData: defaultPersonalInformationData,
                  key: 'personalInformation',
                },
                {
                  title: 'Company Information',
                  description: 'Please provide your company information',
                  formSchema: companyInformationSchema,
                  uiSchema: companyInformationUISchema,
                  defaultData: defaultCompanyInformationData,
                  key: 'companyInformation',
                },
                {
                  title: 'Headquarters Address',
                  description: 'Please provide headquarters address',
                  formSchema: headquartersSchema,
                  uiSchema: headquartersUISchema,
                  defaultData: defaultHeadquartersData,
                  key: 'headquarters',
                },
                {
                  title: 'Company Activity',
                  description: 'Please provide details about company activity',
                  formSchema: companyActivitySchema,
                  uiSchema: companyActivityUISchema,
                  key: 'companyActivity',
                },
                {
                  title: 'Bank Information',
                  description: 'Please provide your bank details',
                  formSchema: bankInformationSchema,
                  uiSchema: bankInformationUISchema,
                  defaultData: defaultBankInformationData,
                  key: 'bankInformation',
                },
                {
                  title: 'Company Ownership',
                  description: 'Please provide ownership details',
                  formSchema: shareholdersSchema,
                  uiSchema: shareholdersUISchema,
                  defaultData: defaultShareholdersData,
                  key: 'ubos',
                },
                {
                  title: 'Company Documents',
                  description: 'Please upload company documents',
                  formSchema: companyDocumentsSchema,
                  uiSchema: companyDocumentsUISchema,
                  defaultData: defaultCompanyDocumentsData,
                  key: 'companyDocuments',
                },
              ],
            },
          },
        },
      },
      run_ubos: {
        on: {
          CONTINUE: [{ target: 'run_kyb_enrichment' }],
          FAILED: [{ target: 'auto_reject' }],
        },
      },
      run_kyb_enrichment: {
        on: {
          KYB_DONE: [{ target: 'pending_kyc_response_to_finish' }],
          // TODO: add 404 handling
          FAILED: [{ target: 'auto_reject' }],
        },
      },
      pending_kyc_response_to_finish: {
        on: {
          KYC_RESPONDED: [
            {
              target: 'manual_review',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[])',
                },
              },
            },
          ],
        },
        always: [
          {
            target: 'manual_review',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'entity.data.additionalInfo.ubos == null || length(entity.data.additionalInfo.ubos) == `0`',
              },
            },
          },
        ],
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approved',
          reject: 'rejected',
          revision: 'revision',
        },
      },
      pending_resubmission: {
        tags: [StateTag.REVISION],
        on: {
          RESUBMITTED: 'manual_review',
        },
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
      revision: {
        tags: [StateTag.REVISION],
        always: [
          {
            target: 'pending_resubmission',
          },
        ],
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'open_corporates',
        pluginKind: 'kyb',
        url: `${env.UNIFIED_API_URL}/companies`,
        method: 'GET',
        stateNames: ['run_kyb_enrichment'],
        successAction: 'KYB_DONE',
        errorAction: 'KYB_DONE',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              countryOfIncorporation: entity.data.countryOfIncorporation,
              companyNumber: entity.data.registrationNumber,
              state: entity.data.dynamicInfo.companyInformation.state
              vendor: 'open-corporates'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@', // jmespath
            },
          ],
        },
      },
      {
        name: 'resubmission_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        method: 'POST',
        stateNames: ['pending_resubmission'],
        headers: {
          Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              kybCompanyName: entity.data.companyName,
              customerCompanyName: entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.customerCompany,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              resubmissionLink: join('',['https://',entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.normalizedCustomerCompany,'.demo.ballerine.app','/workflowRuntimeId=',workflowRuntimeId,'?resubmitEvent=RESUBMITTED']),
              supportEmail: join('',[entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.normalizedCustomerCompany,'@support.com']),
              from: 'no-reply@ballerine.com',
              name: join(' ',[entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.customerCompany,'Team']),
              receivers: [entity.data.additionalInfo.mainRepresentative.email],
              templateId: 'd-7305991b3e5840f9a14feec767ea7301',
              revisionReason: documents[].decision[].revisionReason | [0],
              adapter: '${env.MAIL_ADAPTER}'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [],
        },
      },
    ],
    childWorkflowPlugins: [
      {
        pluginKind: 'child',
        name: 'veriff_kyc_child_plugin',
        definitionId: kycEmailSessionDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '@',
          },
        ],
        initEvent: 'start',
      },
    ],
    commonPlugins: [
      {
        pluginKind: 'iterative',
        name: 'ubos_iterractive',
        actionPluginName: 'veriff_kyc_child_plugin',
        stateNames: ['run_ubos'],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: 'entity.data.additionalInfo.ubos',
          },
        ],
        successAction: 'CONTINUE',
        errorAction: 'FAILED',
      },
    ],
  },
  config: {
    childCallbackResults: [
      {
        definitionId: kycEmailSessionDefinition.name,
        transformers: [
          {
            transformer: 'jmespath',
            mapping:
              '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
          },
        ],
        persistenceStates: ['kyc_manual_review'],
        deliverEvent: 'KYC_RESPONDED',
      },
    ],
  },
  contextSchema: {
    type: 'json-schema',
    schema: defaultContextSchema,
  },
};
export const generateParentKybWithSessionKycs = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: parentKybWithSessionWorkflowDefinition,
  });
};
