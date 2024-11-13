import { WorkflowViewer } from './WorkflowViewer';
import { Meta } from '@storybook/react';

export default {
  component: WorkflowViewer,
  title: 'Organisms/WorkflowViewer',
} as Meta;

const sampleWorkflowDefinition = {
  initial: 'start',
  states: {
    start: {
      tags: ['onboarding'],
      on: {
        NEXT: 'review',
      },
    },
    review: {
      tags: ['review'],
      on: {
        APPROVE: 'approved',
        REJECT: 'rejected',
      },
    },
    approved: {
      tags: ['completion'],
      type: 'final',
    },
    rejected: {
      tags: ['completion', 'failure'],
      type: 'final',
    },
  },
};

export const Default = {
  render: () => (
    <div className="h-[600px] w-[800px] p-4">
      <WorkflowViewer definition={JSON.stringify(sampleWorkflowDefinition)} currentState="start" />
    </div>
  ),
};

export const ComplexWorkflow = {
  render: () => {
    const complexDefinition = {
      initial: 'collect_data',
      states: {
        collect_data: {
          tags: ['data_collection'],
          on: {
            SUBMIT: 'initial_review',
          },
        },
        initial_review: {
          tags: ['review'],
          on: {
            APPROVE: 'kyc_check',
            REJECT: 'rejected',
            REQUEST_MORE_INFO: 'collect_data',
          },
        },
        kyc_check: {
          tags: ['verification'],
          on: {
            PASS: 'final_approval',
            FAIL: 'rejected',
          },
        },
        final_approval: {
          tags: ['review'],
          on: {
            APPROVE: 'approved',
            REJECT: 'rejected',
          },
        },
        approved: {
          tags: ['completion'],
          type: 'final',
        },
        rejected: {
          tags: ['completion', 'failure'],
          type: 'final',
        },
      },
    };

    return (
      <div className="h-[600px] w-[800px] p-4">
        <WorkflowViewer definition={JSON.stringify(complexDefinition)} currentState="kyc_check" />
      </div>
    );
  },
};

export const WithCurrentState = {
  render: () => (
    <div className="h-[600px] w-[800px] p-4">
      <WorkflowViewer definition={JSON.stringify(sampleWorkflowDefinition)} currentState="review" />
    </div>
  ),
};

export const OngoingMonitoringWorkflow = {
  render: () => {
    const workflowDefinition = {
      id: 'ballerinedemo_ongoing_monitoring_demo_ongoing_monitoring_kyb_v1',
      initial: 'idle',
      states: {
        idle: {
          on: {
            START: 'collection_invite',
          },
        },
        collection_invite: {
          on: {
            INVITATION_SENT: 'collection_flow',
            INVITATION_FAILURE: 'failed',
          },
        },
        collection_flow: {
          tags: ['collection_flow'],
          on: {
            COLLECTION_FLOW_FINISHED: [
              {
                target: 'update_entities',
              },
            ],
          },
        },
        update_entities: {
          tags: ['collection_flow'],
          on: {
            UPDATE_ENTITIES_FAILED: [
              {
                target: 'error',
              },
            ],
            ENTITIES_UPDATED_SUCCESSFULLY: [
              {
                target: 'run_merchant_monitoring',
              },
            ],
          },
        },
        run_merchant_monitoring: {
          tags: ['collection_flow'],
          on: {
            MERCHANT_MONITORING_SUCCESS: [
              {
                target: 'run_ubos',
              },
            ],
            MERCHANT_MONITORING_FAILED: [
              {
                target: 'failed',
              },
            ],
          },
        },
        run_ubos: {
          tags: ['collection_flow'],
          on: {
            EMAIL_SENT_TO_UBOS: [
              {
                target: 'run_vendor_data',
              },
            ],
            FAILED_EMAIL_SENT_TO_UBOS: [
              {
                target: 'failed',
              },
            ],
          },
        },
        run_vendor_data: {
          tags: ['data_enrichment'],
          on: {
            VENDOR_DONE: [
              {
                target: 'manual_review',
              },
            ],
            VENDOR_FAILED: 'failed',
          },
        },
        manual_review: {
          tags: ['manual_review'],
          on: {
            approve: 'approved',
            reject: 'rejected',
            revision: 'pending_resubmission',
            KYC_REVISION: 'pending_kyc_response_to_finish',
          },
        },
        pending_resubmission: {
          tags: ['revision'],
          on: {
            EMAIL_SENT: 'revision',
            EMAIL_FAILURE: 'failed',
          },
        },
        revision: {
          tags: ['revision'],
          on: {
            COLLECTION_FLOW_FINISHED: [
              {
                target: 'manual_review',
              },
            ],
          },
        },
        pending_kyc_response_to_finish: {
          tags: ['pending_process'],
          on: {
            KYC_RESPONDED: [
              {
                target: 'manual_review',
              },
            ],
            reject: 'rejected',
            revision: 'pending_resubmission',
          },
        },
        approved: {
          tags: ['approved'],
          type: 'final',
        },
        rejected: {
          tags: ['rejected'],
          type: 'final',
        },
        failed: {
          tags: ['failure'],
          type: 'final',
        },
        error: {
          tags: ['failure'],
        },
      },
    };

    return (
      <div className="h-[800px] w-[1200px] p-4">
        <WorkflowViewer
          definition={JSON.stringify(workflowDefinition)}
          currentState="run_vendor_data"
        />
      </div>
    );
  },
};
