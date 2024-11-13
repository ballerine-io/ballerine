import { FC } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useIsWorkflowViewerOpen } from '@/common/hooks/useIsWorkflowViewerOpen/useIsWorkflowViewerOpen';
import { WorkflowViewer as BaseWorkflowViewer } from '@ballerine/ui';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';

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

export const WorkflowViewer: FC = () => {
  const [{ isWorkflowOpen }] = useSerializedSearchParams();
  const updateIsWorkflowOpen = useIsWorkflowViewerOpen();

  return (
    <Dialog open={isWorkflowOpen}>
      <DialogContent className="h-[95vh] w-[95vw] max-w-[95vw] p-6">
        <BaseWorkflowViewer
          definition={JSON.stringify(workflowDefinition)}
          currentState="rejected"
        />
      </DialogContent>
    </Dialog>
  );
};
