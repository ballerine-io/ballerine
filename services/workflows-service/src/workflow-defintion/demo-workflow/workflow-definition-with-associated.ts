import { defaultContextSchema, StateTag } from '@ballerine/common';
import { kycEmailSessionDefinition } from './generate-kyc-email-process';
import {
  BUSINESS_UBO_AND_SANCTIONS_DONE_OR_ERRORED,
  CHILD_KYB_DONE_RULE,
  KYC_DONE_RULE,
  kycAndVendorDone,
  WEBSITE_ANALYSIS_DONE,
} from './rules';
import { sharedInputSchema } from './shared.idle.schema';

export const generateWorkflowDefinitionWithAssociated = ({
  id,
  name,
  kybChildWorkflowDefinitionId,
  crossEnvKey,
  projectId,
}: {
  id: string;
  name: string;
  kybChildWorkflowDefinitionId: string;
  crossEnvKey?: string;
  projectId?: string;
}) => {
  const noAssociatedCompaniesRule = `entity.data.additionalInfo.associatedCompanies == null || length(entity.data.additionalInfo.associatedCompanies) == \`0\``;
  const noAssociatedCompaniesInProcessRule = `entity.childWorkflows.${kybChildWorkflowDefinitionId} == null || length(entity.data.additionalInfo.${kybChildWorkflowDefinitionId}) == \`0\``;

  return {
    id,
    name,
    crossEnvKey,
    version: 1,
    definitionType: 'statechart-json',
    definition: {
      id: `${id}_v1`,
      predictableActionArguments: true,
      initial: 'idle',
      context: {
        documents: [],
      },
      states: {
        idle: {
          on: {
            START: 'collection_invite',
          },
          meta: {
            inputSchema: sharedInputSchema,
          },
        },
        collection_invite: {
          on: {
            INVITATION_SENT: 'collection_flow',
            INVITATION_FAILURE: 'failed',
          },
        },
        collection_flow: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            COLLECTION_FLOW_FINISHED: [{ target: 'update_entities' }],
          },
        },
        update_entities: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            ENTITIES_UPDATED_SUCCESSFULLY: [
              {
                target: 'run_merchant_monitoring',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: noAssociatedCompaniesRule,
                  },
                },
              },
              { target: 'generate_associated_companies' },
            ],
            UPDATE_ENTITIES_FAILED: [{ target: 'error' }],
          },
        },
        generate_associated_companies: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            ASSOCIATED_COMPANIES_GENERATED: [{ target: 'run_merchant_monitoring' }],
            ASSOCIATED_COMPANIES_FAILED: [{ target: 'failed' }],
          },
        },
        run_merchant_monitoring: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            MERCHANT_MONITORING_SUCCESS: [{ target: 'run_ubos' }],
            MERCHANT_MONITORING_FAILED: [{ target: 'failed' }],
          },
        },
        run_ubos: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            EMAIL_SENT_TO_UBOS: [{ target: 'run_vendor_data' }],
            FAILED_EMAIL_SENT_TO_UBOS: [{ target: 'failed' }],
          },
        },
        run_vendor_data: {
          tags: [StateTag.DATA_ENRICHMENT],
          on: {
            KYC_RESPONDED: [kycAndVendorDone],
            VENDOR_DONE: [
              {
                target: 'pending_kyc_response_to_finish',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `!(${KYC_DONE_RULE()}) && ${BUSINESS_UBO_AND_SANCTIONS_DONE_OR_ERRORED} && ${WEBSITE_ANALYSIS_DONE}`,
                  },
                },
              },
              kycAndVendorDone,
            ],
            VENDOR_FAILED: 'failed',
          },
        },
        pending_kyc_response_to_finish: {
          tags: [StateTag.PENDING_PROCESS],
          on: {
            KYC_RESPONDED: [
              {
                target: 'manual_review',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `${KYC_DONE_RULE()} &&
                    (${noAssociatedCompaniesRule} || ${noAssociatedCompaniesInProcessRule}) ||
                    (${CHILD_KYB_DONE_RULE(kybChildWorkflowDefinitionId)})`,
                  },
                },
              },
              {
                target: 'pending_kyb_response_to_finish',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `${KYC_DONE_RULE()} &&
                    !(${noAssociatedCompaniesRule}) && !(${CHILD_KYB_DONE_RULE(
                      kybChildWorkflowDefinitionId,
                    )})`,
                  },
                },
              },
            ],
            reject: 'rejected',
            revision: 'pending_resubmission',
          },
        },
        pending_kyb_response_to_finish: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            ASSOCIATED_COMPANY_KYB_FINISHED: [
              {
                target: 'manual_review',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: CHILD_KYB_DONE_RULE(kybChildWorkflowDefinitionId),
                  },
                },
              },
            ],
            reject: 'rejected',
            revision: 'pending_resubmission',
          },
        },
        manual_review: {
          tags: [StateTag.MANUAL_REVIEW],
          on: {
            approve: 'approved',
            reject: 'rejected',
            revision: 'pending_resubmission',
            KYC_REVISION: 'pending_kyc_response_to_finish',
          },
        },
        pending_resubmission: {
          tags: [StateTag.REVISION],
          on: {
            EMAIL_SENT: 'revision',
            EMAIL_FAILURE: 'failed',
          },
        },
        error: {
          tags: [StateTag.FAILURE],
        },
        failed: {
          tags: [StateTag.FAILURE],
          type: 'final' as const,
        },
        approved: {
          tags: [StateTag.APPROVED],
          type: 'final' as const,
        },
        revision: {
          tags: [StateTag.REVISION],
          on: {
            COLLECTION_FLOW_FINISHED: [
              {
                target: 'manual_review',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `${KYC_DONE_RULE()} &&
                    (${noAssociatedCompaniesRule} || ${noAssociatedCompaniesInProcessRule}) &&
                    (${CHILD_KYB_DONE_RULE(kybChildWorkflowDefinitionId)})`,
                  },
                },
              },
              {
                target: 'pending_kyc_response_to_finish',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `!${KYC_DONE_RULE()} &&
                    (${noAssociatedCompaniesRule} || ${noAssociatedCompaniesInProcessRule}) &&
                    (${CHILD_KYB_DONE_RULE(kybChildWorkflowDefinitionId)})`,
                  },
                },
              },
            ],
          },
        },
        rejected: {
          tags: [StateTag.REJECTED],
          type: 'final' as const,
        },
      },
    },
    extensions: {
      apiPlugins: [
        {
          name: 'invitation-email',
          pluginKind: 'template-email',
          template: 'invitation',
          successAction: 'INVITATION_SENT',
          errorAction: 'INVITATION_FAILURE',
          stateNames: ['collection_invite'],
        },
        {
          name: 'businessInformation',
          vendor: 'asia-verify',
          pluginKind: 'registry-information',
          displayName: 'Registry Information',
          stateNames: ['run_vendor_data'],
          successAction: 'VENDOR_DONE',
          errorAction: 'VENDOR_DONE',
        },
        {
          name: 'companySanctions',
          vendor: 'asia-verify',
          pluginKind: 'company-sanctions',
          displayName: 'Company Sanctions',
          stateNames: ['run_vendor_data'],
          successAction: 'VENDOR_DONE',
          errorAction: 'VENDOR_FAILED',
        },
        {
          name: 'ubo',
          vendor: 'asia-verify',
          pluginKind: 'ubo',
          displayName: 'UBO Check',
          stateNames: ['run_vendor_data'],
          successAction: 'VENDOR_DONE',
          errorAction: 'VENDOR_FAILED',
        },
        {
          name: 'resubmission-email',
          pluginKind: 'template-email',
          template: 'resubmission',
          successAction: 'EMAIL_SENT',
          errorAction: 'EMAIL_FAILURE',
          stateNames: ['pending_resubmission'],
        },
        {
          name: 'merchantMonitoring',
          pluginKind: 'merchant-monitoring',
          vendor: 'ballerine',
          displayName: 'Merchant Monitoring',
          stateNames: ['run_merchant_monitoring'],
          successAction: 'MERCHANT_MONITORING_SUCCESS',
          errorAction: 'MERCHANT_MONITORING_FAILED',
          reportType: 'MERCHANT_REPORT_T1',
          merchantMonitoringQualityControl: false,
          dataMapping: `
            websiteUrl: entity.data.additionalInfo.companyWebsite,
            businessId: entity.ballerineEntityId,
            customerId: metadata.customerId,
            merchantId: entity.ballerineEntityId,
            countryCode: entity.data.country,
            workflowVersion: '2'
          `,
        },
      ],
      dispatchEventPlugins: [
        {
          name: 'update_entities',
          pluginKind: 'dispatch-event',
          stateNames: ['update_entities'],
          eventName: 'ENTITIES_UPDATE',
          errorAction: 'UPDATE_ENTITIES_FAILED',
          successAction: 'ENTITIES_UPDATED_SUCCESSFULLY',
          transformers: [
            {
              transformer: 'jmespath',
              mapping: `{
                ubos: entity.data.additionalInfo.ubos,
                directors: entity.data.additionalInfo.directors
              }`,
            },
          ],
        },
      ],
      childWorkflowPlugins: [
        {
          pluginKind: 'child',
          name: 'veriff_kyc_child_plugin',
          definitionId: kycEmailSessionDefinition().id,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: `{entity: {data: @, type: 'individual'}}`,
            },
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'entity.data',
                  target: 'entity.data',
                  method: 'omit',
                  value: ['workflowRuntimeId', 'workflowRuntimeConfig'],
                },
              ],
            },
          ],
          initEvent: 'start',
        },
        {
          pluginKind: 'child',
          name: 'associated_company_child_plugin',
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: `{entity: {data: @, type: 'business'}, documents: documents}`,
            },
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'entity.data',
                  target: 'entity.data',
                  method: 'omit',
                  value: ['workflowRuntimeId', 'workflowRuntimeConfig', 'documents'],
                },
              ],
            },
          ],
        },
      ],
      commonPlugins: [
        {
          pluginKind: 'riskRules',
          name: 'riskEvaluation',
          stateNames: ['manual_review', 'run_vendor_data', 'pending_kyc_response_to_finish'],
          rulesSource: {
            source: 'notion',
            databaseId: '2117f1074d4848cf8e4714df31a2aa06',
          },
        },
        {
          pluginKind: 'iterative',
          name: 'ubos_iterative',
          actionPluginName: 'veriff_kyc_child_plugin',
          stateNames: ['run_ubos'],
          iterateOn: [
            {
              transformer: 'jmespath',
              mapping: 'entity.data.additionalInfo.ubos',
            },
          ],
          successAction: 'EMAIL_SENT_TO_UBOS',
          errorAction: 'FAILED_EMAIL_SENT_TO_UBOS',
        },
        {
          pluginKind: 'iterative',
          name: 'associated_company_iterative',
          actionPluginName: 'associated_company_child_plugin',
          stateNames: ['generate_associated_companies'],
          iterateOn: [
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'entity.data.additionalInfo.associatedCompanies',
                  target: 'entity.data.additionalInfo.associatedCompanies',
                  method: 'mergeArrayEachItemWithValue',
                  options: {
                    mapJmespath: 'entity.data.additionalInfo.associatedCompanies',
                    mergeWithJmespath:
                      '{ additionalInfo: { customerName: metadata.customerName, kybCompanyName: entity.data.companyName } }',
                  },
                },
              ],
            },
            {
              transformer: 'jmespath',
              mapping: 'entity.data.additionalInfo.associatedCompanies',
            },
          ],
          successAction: 'ASSOCIATED_COMPANIES_GENERATED',
          errorAction: 'ASSOCIATED_COMPANIES_FAILED',
        },
      ],
    },
    config: {
      language: 'en',
      supportedLanguages: ['en', 'cn'],
      initialEvent: 'START',
      createCollectionFlowToken: true,
      childCallbackResults: [
        {
          definitionId: kycEmailSessionDefinition().name,
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
        {
          definitionId: kycEmailSessionDefinition().name,
          persistenceStates: ['revision_email_sent'],
          transformers: [
            {
              transformer: 'jmespath',
              mapping:
                '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
            },
          ],
          deliverEvent: 'KYC_REVISION',
        },
        {
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: '{childEntity: entity.data}', // jmespath
            },
          ],
          persistenceStates: ['manual_review'],
          deliverEvent: 'ASSOCIATED_COMPANY_KYB_FINISHED',
        },
        {
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: '{childEntity: entity.data}', // jmespath
            },
          ],
          persistenceStates: ['pending_associated_kyb_collection_flow'],
          deliverEvent: 'ASSOCIATED_COMPANY_IN_KYB',
        },
        {
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: '{childEntity: entity.data}', // jmespath
            },
          ],
          persistenceStates: ['revision'],
          deliverEvent: 'revision',
        },
      ],
      workflowLevelResolution: true,
      isCaseOverviewEnabled: true,
      isAssociatedCompanyKybEnabled: true,
      isCaseRiskOverviewEnabled: true,
      enableManualCreation: true,
    },
    contextSchema: {
      type: 'json-schema',
      schema: defaultContextSchema,
    },
    isPublic: !projectId,
    ...(projectId && { projectId }),
  };
};
