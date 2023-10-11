import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag } from '@ballerine/common';

import { env } from '../../src/env';
import { kycEmailSessionDefinition } from './kyc-email-process-example';
import { parentKybWithSessionWorkflowDefinition } from './parent-kyb-kyc-session-workflow';

export const fullKybProcessWorkflowDefinition = {
  id: 'full_kyb_process',
  name: 'full_kyb_process',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'full_kyb_process_v1',
    predictableActionArguments: true,
    initial: 'data_collection',
    context: {
      documents: [],
    },
    states: {
      data_collection: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          COLLECTION_FLOW_FINISHED: [
            {
              target: 'run_cn_kyb',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'entity.data.additionalInfo.country == `cn`', // @TODO: Work out companyNumber with Daniel
                },
              },
            },
            {
              target: 'run_hk_kyb',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'entity.data.additionalInfo.country == `hk`', // @TODO: Work out companyNumber with Daniel
                },
              },
            },
            {
              target: 'auto_reject',
            },
          ],
        },
      },
      run_cn_kyb: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // CN_KYB_DONE: [{ target: 'run_aml' }],
          CN_KYB_DONE: [{ target: 'run_vendor_data_collection' }],
          CN_KYB_FAIL: [{ target: 'failure' }],
        },
      },
      run_hk_kyb: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // HK_KYB_HOOK_RESPONDED: [{ target: 'run_aml' }],
          HK_KYB_HOOK_RESPONDED: [{ target: 'run_vendor_data_collection' }],
          FAILED: [{ target: 'failure' }],
        },
      },
      run_vendor_data_collection: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          VENDOR_DATA_COLLECTION_DONE: [{ target: 'manual_review' }],
          VENDOR_DATA_COLLECTION_FAIL: [{ target: 'failure' }],
        },
      },
      // run_aml: {
      //   tags: [StateTag.PENDING_PROCESS],
      //   on: {
      //     CONTINUE: [{ target: 'run_ubos' }],
      //     // @TODO: add 404 handling
      //     FAILED: [{ target: 'failure' }],
      //   },
      // },
      // run_ubos: {
      //   tags: [StateTag.PENDING_PROCESS],
      //   on: {
      //     CONTINUE: [{ target: 'run_kyb_enrichment' }],
      //     FAILED: [{ target: 'failure' }],
      //   },
      // },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          APPROVE: 'approved',
          REJECT: 'rejected',
          REVISION: 'revision',
        },
      },
      revision: {
        tags: [StateTag.REVISION, StateTag.COLLECTION_FLOW],
        on: {
          RESUBMITTED: 'manual_review',
        },
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      failure: {
        tags: [StateTag.MANUAL_REVIEW],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'asia_verify_cn_kyb',
        pluginKind: 'kyb',
        url: `${env.UNIFIED_API_URL}/companies-v2`,
        method: 'GET',
        stateNames: ['run_cn_kyb'],
        successAction: 'CN_KYB_DONE',
        errorAction: 'CN_KYB_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.registrationNumber" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.registrationNumber,
                countryOfIncorporation: 'cn',
                vendor: 'asia-verify'
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
        // @TODO: handle callback
        name: 'asia_verify_hk_kyb',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/companies-v2`,
        method: 'GET',
        stateNames: ['run_hk_kyb'],
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.registrationNumber" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.registrationNumber,
                countryOfIncorporation: 'hk',
                vendor: 'asia-verify'
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/HK_KYB_HOOK_RESPONDED','?resultDestination=pluginsOutput.hk_kyb.result']),
              }`, // jmespath
            },
          ],
        },
      },
      {
        name: 'asia_verify_aml',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.additionalInfo.country}/{entity.data.companyName}/aml`,
        method: 'GET',
        stateNames: ['run_vendor_data_collection'],
        successAction: 'VENDOR_DATA_COLLECTION_DONE',
        errorAction: 'VENDOR_DATA_COLLECTION_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.companyName" and "entity.data.additionalInfo.country" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyName: entity.data.companyName,
                countryOfIncorporation: entity.data.additionalInfo.country,
                vendor: 'asia-verify'
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
        name: 'asia_verify_aml',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.additionalInfo.country}/{entity.data.companyName}/ubo`,
        method: 'GET',
        stateNames: ['run_vendor_data_collection'],
        successAction: 'VENDOR_DATA_COLLECTION_DONE',
        errorAction: 'VENDOR_DATA_COLLECTION_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.companyName" and "entity.data.additionalInfo.country" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.companyNumber,
                countryOfIncorporation: entity.data.additionalInfo.country,
                vendor: 'asia-verify',
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/UBO_HOOK_RESPONDED','?resultDestination=pluginsOutput.hk_kyb.result']),
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
        stateNames: ['revision'],
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
    schema: defaultContextSchema, // @TODO: Go over this with Daniel
  },
  isPublic: true,
};

export const generateFullKybProcess = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: { ...parentKybWithSessionWorkflowDefinition },
  });
};
