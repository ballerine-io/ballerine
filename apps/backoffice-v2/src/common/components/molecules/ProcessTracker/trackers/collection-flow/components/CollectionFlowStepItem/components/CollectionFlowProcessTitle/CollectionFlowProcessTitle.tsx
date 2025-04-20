import { ctw } from '@/common/utils/ctw/ctw';
import { RequestProcesses } from './components/RequestProcesses';
import { useStepsRequesting } from './hooks/useStepsRequesting';
import { useTracker } from '../../../../../../components/Tracker/hooks/useTracker';
import { Tracker } from '../../../../../../components/Tracker/Tracker';
import { useIsWorkflowStepsCanBeRevised } from '../../hooks/useIsWorkflowStepsCanBeRevised';

export const CollectionFlowProcessTitle = () => {
  const { workflow } = useTracker();
  const { stepsCountToRequest, isLoading, sendRequestedStepsToRevision } =
    useStepsRequesting(workflow);
  const isShouldDisplayRequestButton = stepsCountToRequest > 0;

  const isCanRequestSteps = useIsWorkflowStepsCanBeRevised({
    workflowAssigneeId: workflow.assigneeId || workflow.assignee?.id,
    workflowConfig: workflow.workflowDefinition.config,
    workflowTags: workflow.tags,
  });

  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 pr-2 !no-underline hover:no-underline">
      <Tracker.Title
        className={ctw({
          ['max-w-[60px] overflow-hidden text-ellipsis']: isShouldDisplayRequestButton,
        })}
        title={isShouldDisplayRequestButton ? 'Collection Flow' : undefined}
        text="Collection Flow"
      />
      {stepsCountToRequest > 0 && (
        <RequestProcesses
          requestCount={stepsCountToRequest}
          isLoading={isLoading}
          disabled={!isCanRequestSteps}
          onConfirm={sendRequestedStepsToRevision}
        />
      )}
    </div>
  );
};
