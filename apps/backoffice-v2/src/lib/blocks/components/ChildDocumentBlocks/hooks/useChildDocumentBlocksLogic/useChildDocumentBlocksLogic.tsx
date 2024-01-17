import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { UnknownRecord } from '@/common/types';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useDocumentBlocks } from '@/lib/blocks/hooks/useDocumentBlocks/useDocumentBlocks';
import { checkIsKybExampleVariant } from '@/lib/blocks/variants/variant-checkers';

export const useChildDocumentBlocksLogic = ({
  parentWorkflowId,
  childWorkflow,
  parentMachine,
  onReuploadNeeded,
  isLoadingReuploadNeeded,
}: {
  parentWorkflowId: string;
  childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number];
  parentMachine: UnknownRecord;
  onReuploadNeeded: ({
    workflowId,
    documentId,
    reason,
  }: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
}) => {
  const filterId = useFilterId();
  const { data: parentWorkflow } = useWorkflowByIdQuery({
    workflowId: parentWorkflowId,
    filterId,
  });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, parentWorkflow);
  const { noAction } = useCaseDecision();
  const isWorkflowLevelResolution =
    parentWorkflow?.workflowDefinition?.config?.workflowLevelResolution ??
    parentWorkflow?.context?.entity?.type === 'business';
  const isKybExampleVariant = checkIsKybExampleVariant(parentWorkflow?.workflowDefinition);

  const childDocumentBlocks = useDocumentBlocks({
    workflow: childWorkflow,
    parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: true,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    dialog: {
      reupload: {
        Description: () => (
          <p className="text-sm">
            {isWorkflowLevelResolution && (
              <>
                Once marked, you can use the “Ask for all re-uploads” button at the top of the
                screen to initiate a request for the customer to re-upload all of the documents you
                have marked for re-upload.
              </>
            )}
            {!isWorkflowLevelResolution && (
              <>
                <span className="mb-[10px] block">
                  By clicking the button below, an email with a link will be sent to the customer,
                  directing them to re-upload the documents you have marked as “re-upload needed”.
                </span>
                <span>
                  The case’s status will then change to “Revisions” until the customer will provide
                  the needed documents and fixes.
                </span>
              </>
            )}
          </p>
        ),
      },
    },
    actions: {
      reuploadNeeded: {
        isDisabled: isKybExampleVariant,
      },
    },
  });

  return childDocumentBlocks;
};
