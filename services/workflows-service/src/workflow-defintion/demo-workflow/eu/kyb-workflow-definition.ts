import { defaultContextSchema, StateTag } from '@ballerine/common';
import { BUILT_IN_ACTION } from '@ballerine/workflow-core';
import {
  BUSINESS_INFORMATION_DONE_OR_ERRORED,
  KYC_DONE_RULE,
  MERCHANT_SCREENING_DONE_OR_ERRORED,
  SANCTIONS_DONE,
  UBO_DONE_OR_ERRORED,
  WEBSITE_ANALYSIS_DONE,
} from 'prisma/data-migrations/templates/utils/rules';
import { createPluginSyncResponseTransform } from 'prisma/data-migrations/utils/create-plugin-response-mapping';
import { demoInputSchema } from './demo.idle.schema';
import { generateKycDefinition } from './kyc-workflow-definition';

export const generateWorkflowDefinition = ({
  id,
  name,
  projectId,
  crossEnvKey,
  kycChildWorkflowDefinitionId = generateKycDefinition().id,
  merchantMonitoringQualityControl = true,
  mockUbos = false,
  mockSanctions = false,
  mockBusinessInformation = false,
  withQualityControl = true,
  config,
}: {
  id: string;
  crossEnvKey: string;
  name: string;
  projectId: string;
  kycChildWorkflowDefinitionId?: string;
  merchantMonitoringQualityControl?: boolean;
  mockUbos?: boolean;
  mockSanctions?: boolean;
  mockBusinessInformation?: boolean;
  withQualityControl?: boolean;
  config?: {
    disableVideoGuide?: boolean;
    disableAiSummary?: boolean;
  };
}) => {
  return {
    id,
    name,
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
            inputSchema: demoInputSchema,
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
            COLLECTION_FLOW_FINISHED: [{ target: 'run_merchant_monitoring' }],
          },
        },
        run_merchant_monitoring: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            VENDOR_DONE: [{ target: 'run_ubos' }],
            VENDOR_FAILED: [{ target: 'failed' }],
          },
        },
        rerun_vendor_data: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            VENDOR_DONE: [{ target: 'manual_review' }],
            VENDOR_FAILED: [{ target: 'failed' }],
          },
        },
        run_ubos: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            EMAIL_SENT_TO_UBOS: [{ target: 'run_directors_wo_auth_signatory' }],
            FAILED_EMAIL_SENT_TO_UBOS: [{ target: 'failed' }],
          },
        },
        run_directors_wo_auth_signatory: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            EMAIL_SENT_TO_DIRECTORS: [{ target: 'run_directors_w_auth_signatory' }],
            FAILED_EMAIL_SENT_TO_DIRECTORS: [{ target: 'failed' }],
          },
        },
        run_directors_w_auth_signatory: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            EMAIL_SENT_TO_DIRECTORS: [{ target: 'run_vendor_data' }],
            FAILED_EMAIL_SENT_TO_DIRECTORS: [{ target: 'failed' }],
          },
        },
        run_vendor_data: {
          tags: [StateTag.DATA_ENRICHMENT],
          on: {
            KYC_RESPONDED: [
              {
                target: 'manual_review',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `${KYC_DONE_RULE(
                      kycChildWorkflowDefinitionId,
                    )} && ${SANCTIONS_DONE} && ${WEBSITE_ANALYSIS_DONE} && ${MERCHANT_SCREENING_DONE_OR_ERRORED} && ${UBO_DONE_OR_ERRORED} && ${BUSINESS_INFORMATION_DONE_OR_ERRORED}`,
                  },
                },
              },
            ],
            VENDOR_DONE: [
              {
                target: 'manual_review',
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: `${SANCTIONS_DONE} && ${WEBSITE_ANALYSIS_DONE} && ${MERCHANT_SCREENING_DONE_OR_ERRORED} && ${UBO_DONE_OR_ERRORED} && ${BUSINESS_INFORMATION_DONE_OR_ERRORED}`,
                  },
                },
              },
            ],
            VENDOR_FAILED: 'failed',
            NO_OP: {
              actions: BUILT_IN_ACTION.NO_OP,
            },
          },
        },
        edit: {
          tags: [StateTag.EDIT],
          on: {
            COLLECTION_FLOW_FINISHED: [{ target: 'rerun_vendor_data' }],
          },
        },
        manual_review: {
          tags: [StateTag.MANUAL_REVIEW],
          on: {
            approve: 'approved',
            reject: 'rejected',
            revision: 'pending_resubmission',
            edit: 'edit',
            KYC_REVISION: {
              actions: BUILT_IN_ACTION.NO_OP,
            },
            KYC_RESPONDED: {
              actions: BUILT_IN_ACTION.NO_OP,
            },
            NO_OP: {
              actions: BUILT_IN_ACTION.NO_OP,
            },
            VENDOR_DONE: {
              actions: BUILT_IN_ACTION.NO_OP,
            },
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
            revision: 'pending_resubmission',
            COLLECTION_FLOW_FINISHED: [
              {
                target: 'manual_review',
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
          vendor: 'kyckr',
          pluginKind: 'registry-information',
          displayName: 'Registry Information',
          stateNames: ['run_vendor_data', 'rerun_vendor_data'],
          errorAction: 'VENDOR_DONE',
          successAction: 'VENDOR_DONE',
        },
        {
          name: 'companySanctions',
          vendor: mockSanctions ? 'test' : 'asia-verify',
          pluginKind: 'company-sanctions',
          stateNames: ['run_vendor_data', 'rerun_vendor_data'],
          displayName: 'Company Sanctions',
          errorAction: 'VENDOR_DONE',
          successAction: 'VENDOR_DONE',
          defaultCountry: '{entity.data.country}',
        },
        {
          name: 'ubo',
          vendor: mockUbos ? 'test' : 'kyckr',
          pluginKind: 'ubo',
          stateNames: ['run_vendor_data'],
          displayName: 'UBO Check',
          errorAction: 'VENDOR_DONE',
          successAction: 'VENDOR_DONE',
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
          name: 'case-ready-email',
          pluginKind: 'template-email',
          template: 'case-ready-for-review',
          successAction: 'NO_OP',
          errorAction: 'NO_OP',
          stateNames: ['manual_review'],
        },
        {
          name: 'merchantMonitoring',
          pluginKind: 'merchant-monitoring',
          vendor: 'ballerine',
          displayName: 'Merchant Monitoring',
          stateNames: ['run_merchant_monitoring', 'rerun_vendor_data'],
          successAction: 'VENDOR_DONE',
          errorAction: 'VENDOR_DONE',
          merchantMonitoringQualityControl: withQualityControl,
          dataMapping: `
            businessId: entity.ballerineEntityId,
            customerId: metadata.customerId,
            merchantId: entity.ballerineEntityId,
            countryCode: entity.data.country,
            websiteUrl: entity.data.additionalInfo.mainWebsite.url,
            workflowVersion: '2',
          `,
        },
        {
          name: 'merchantScreening',
          displayName: 'Merchant Screening',
          pluginKind: 'mastercard-merchant-screening',
          stateNames: ['run_vendor_data', 'rerun_vendor_data'],
          successAction: 'VENDOR_DONE',
          errorAction: 'VENDOR_DONE',
          persistResponseDestination: 'pluginsOutput.merchantScreening',
          request: {
            transform: [
              {
                transformer: 'jmespath',
                mapping: `{ searchGlobally: \`true\` }`,
              },
            ],
          },
          response: {
            transform: createPluginSyncResponseTransform(
              'merchantScreening',
              `vendor: 'mastercard', logoUrl: 'https://cdn.ballerine.io/logos/Mastercard%20logo.svg'`,
            ),
          },
        },
        {
          name: 'sanctionsScreening',
          pluginKind: 'individual-sanctions-v2',
          displayName: 'Sanctions Screening',
          stateNames: [],
          successAction: 'NO_OP',
          payload: {
            clientId: 'demo_account',
            vendor: 'veriff',
            ongoingMonitoring: false,
            immediateResults: true,
            workflowRuntimeId: {
              __type: 'path',
              value: 'workflowRuntimeId',
            },
            endUserId: {
              __type: 'path',
              value: 'ballerineEntityId',
            },
            kycInformation: {
              __type: 'path',
              value: '*',
            },
          },
        },
        {
          url: 'https://hook.eu2.make.com/z35ef17qw95lvo7lzmqledy21y1uz3cp',
          name: 'Update Salesforce (Submittion)',
          method: 'POST',
          request: {
            transform: [
              {
                mapping: '{data: @}',
                transformer: 'jmespath',
              },
            ],
          },
          stateNames: ['run_merchant_monitoring', 'rerun_vendor_data'],
        },
      ],
      childWorkflowPlugins: [
        {
          pluginKind: 'child',
          name: 'veriff_kyc_child_plugin',
          definitionId: kycChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: `{entity: {data: @, type: 'individual', variant: 'ubo'}, documents: documents}`,
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
      ],
      commonPlugins: [
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
          name: 'directors_iterative_w_sanctions',
          actionPluginName: 'sanctionsScreening',
          stateNames: ['run_directors_wo_auth_signatory'],
          iterateOn: [
            {
              mapping: 'entity.data.additionalInfo.directors',
              transformer: 'jmespath',
            },
          ],
          filter: [
            {
              strategy: 'json-logic',
              value: {
                or: [
                  { '!': { var: 'isAuthorizedSignatory' } },
                  { '==': [{ var: 'isAuthorizedSignatory' }, null] },
                ],
              },
            },
          ],
          errorAction: 'FAILED_EMAIL_SENT_TO_DIRECTORS',
          successAction: 'EMAIL_SENT_TO_DIRECTORS',
        },
        {
          pluginKind: 'iterative',
          name: 'directors_iterative_w_idv',
          actionPluginName: 'veriff_kyc_child_plugin',
          stateNames: ['run_directors_w_auth_signatory'],
          iterateOn: [
            {
              mapping: 'entity.data.additionalInfo.directors',
              transformer: 'jmespath',
            },
          ],
          filter: [
            {
              strategy: 'json-logic',
              value: { '==': [{ var: 'isAuthorizedSignatory' }, true] },
            },
          ],
          errorAction: 'FAILED_EMAIL_SENT_TO_DIRECTORS',
          successAction: 'EMAIL_SENT_TO_DIRECTORS',
        },
        {
          pluginKind: 'riskRules',
          name: 'riskEvaluation',
          stateNames: ['manual_review', 'run_vendor_data', 'rerun_vendor_data'],
          rulesSource: {
            source: 'notion',
            databaseId: '1830b0d7875c8014ad74d5bad51ed9c9',
          },
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
          definitionId: kycChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping:
                '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
            },
          ],
          persistenceStates: ['manual_review'],
          deliverEvent: 'KYC_RESPONDED',
        },
        {
          definitionId: kycChildWorkflowDefinitionId,
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
      ],
      workflowLevelResolution: true,
      enableManualCreation: true,
      isCaseOverviewEnabled: true,
      isCaseRiskOverviewEnabled: true,
      isDocumentTrackerEnabled: true,
      isDocumentsV2: true,
      isInitiateSanctionsScreeningEnabled: true,
      editableContext: {
        entityInfo: true,
        kyc: {
          entity: true,
        },
      },
      ubos: {
        create: {
          enabled: true,
        },
      },
      isCollectionFlowPageRevisionEnabled: true,
      isAgentEditingEnabled: true,
      ...config,
    },
    crossEnvKey,
    contextSchema: {
      type: 'json-schema',
      schema: defaultContextSchema,
    },
    isPublic: !projectId,
    ...(projectId && { projectId }),
  };
};
