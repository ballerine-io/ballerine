import { defaultContextSchema, StateTag } from '@ballerine/common';
import { COLLECTION_FLOW_URL, EMAIL_API_URL, Event, State, UNIFIED_API_URL } from './constants';

export const dynamicUiWorkflowDefinition = {
  id: 'kyb_dynamic_ui_session_example',
  name: 'kyb_dynamic_ui_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_dynamic_ui_session_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          [Event.START]: State.COLLECTION_INVITE,
        },
      },
      [State.COLLECTION_INVITE]: {
        on: {
          [Event.INVITATION_SENT]: State.COLLECTION_FLOW,
          [Event.INVIATION_FAILURE]: State.FAILED,
        },
      },
      [State.COLLECTION_FLOW]: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          COLLECTION_FLOW_FINISHED: State.RUN_KYB_ENRICHMENT,
        },
      },
      [State.RUN_KYB_ENRICHMENT]: {
        on: {
          KYB_DONE: State.RUN_UBOS,
          FAILED: State.RUN_UBOS,
        },
      },
      [State.RUN_UBOS]: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          EMAIL_SENT_TO_UBOS: [{ target: State.PENDING_KYC_RESPONSE_TO_FINISH }],
          FAILED_EMAIL_SENT_TO_UBOS: [{ target: 'failed' }],
        },
      },
      [State.PENDING_KYC_RESPONSE_TO_FINISH]: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          [Event.KYC_RESPONDED]: [
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
        },
      },
      pending_resubmission: {
        tags: [StateTag.REVISION],
        on: {
          EMAIL_SENT: 'revision',
          EMAIL_FAILURE: 'failed',
        },
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
                  rule: 'length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[])',
                },
              },
            },
            { target: State.PENDING_KYC_RESPONSE_TO_FINISH },
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
        name: 'open_corporates',
        pluginKind: 'kyb',
        url: `${UNIFIED_API_URL}/companies`,
        method: 'GET',
        stateNames: [State.RUN_KYB_ENRICHMENT],
        successAction: 'KYB_DONE',
        errorAction: 'FAILED',
        headers: { Authorization: 'Bearer 123' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                countryOfIncorporation: entity.data.country,
                companyNumber: entity.data.registrationNumber,
                state: entity.data.additionalInfo.state,
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
        name: 'collection_invite_email',
        pluginKind: 'email',
        url: EMAIL_API_URL,
        successAction: Event.INVITATION_SENT,
        errorAction: 'INVIATION_FAILURE',
        method: 'POST',
        stateNames: [State.COLLECTION_INVITE],
        headers: {
          Authorization: 'Bearer 321',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              companyName: entity.data.companyName,
              customerName: metadata.customerName,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              collectionFlowUrl: join('',['${COLLECTION_FLOW_URL}','/?token=',metadata.token]),
              from: 'no-reply@ballerine.com',
              receivers: [entity.data.additionalInfo.mainRepresentative.email],
              templateId: 'd-8949519316074e03909042cfc5eb4f02',
              adapter: 'sendgrid'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [],
        },
      },
      {
        name: 'resubmission_email',
        pluginKind: 'email',
        url: EMAIL_API_URL,
        method: 'POST',
        successAction: 'EMAIL_SENT',
        errorAction: 'EMAIL_FAILURE',
        stateNames: ['pending_resubmission'],
        headers: {
          Authorization: 'Bearer 321',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              // #TODO: create new token (new using old one)
              mapping: `{
              kybCompanyName: entity.data.companyName,
              customerCompanyName: metadata.customerName,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              resubmissionLink: join('',['${COLLECTION_FLOW_URL}','/?token=',metadata.token]),
              supportEmail: join('',['support@',metadata.customerName,'.com']),
              from: 'no-reply@ballerine.com',
              name: join(' ',[metadata.customerName,'Team']),
              receivers: [entity.data.additionalInfo.mainRepresentative.email],
              templateId: 'd-7305991b3e5840f9a14feec767ea7301',
              revisionReason: documents[].decision[].revisionReason | [0],
              adapter: 'sendgrid'
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
        definitionId: 'kyc_email_session_example',
        transformers: [
          {
            transformer: 'jmespath',
            mapping: `{entity: {data: @, type: 'individual'}}`,
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
        stateNames: [State.RUN_UBOS],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: 'entity.data.additionalInfo.ubos',
          },
        ],
        successAction: 'EMAIL_SENT_TO_UBOS',
        errorAction: 'FAILED_EMAIL_SENT_TO_UBOS',
      },
    ],
  },
  config: {
    initialEvent: Event.START,
    createCollectionFlowToken: true,
    childCallbackResults: [
      {
        definitionId: 'kyc_email_session_example',
        transformers: [
          {
            transformer: 'jmespath',
            mapping:
              '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
          },
        ],
        persistenceStates: ['kyc_manual_review'],
        deliverEvent: Event.KYC_RESPONDED,
      },
    ],
  },
  contextSchema: {
    type: 'json-schema',
    schema: defaultContextSchema,
  },
  isPublic: true,
};
