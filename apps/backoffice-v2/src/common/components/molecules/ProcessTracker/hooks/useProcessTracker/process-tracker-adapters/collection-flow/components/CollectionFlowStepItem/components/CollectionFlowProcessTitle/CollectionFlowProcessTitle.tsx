import { ctw } from '@/common/utils/ctw/ctw';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useIsWorkflowStepsCanBeRevised } from '../../hooks/useIsWorkflowStepsCanBeRevised';
import { RequestProcesses } from './components/RequestProcesses';
import { useStepsRequesting } from './hooks/useStepsRequesting';

interface ICollectionFlowProcessTitleProps {
  workflow: TWorkflowById;
}

export const CollectionFlowProcessTitle = ({ workflow }: ICollectionFlowProcessTitleProps) => {
  const { stepsCountToRequest, isLoading, sendRequestedStepsToRevision } =
    useStepsRequesting(workflow);
  const isShouldDisplayRequestButton = stepsCountToRequest > 0;

  const isCanRequestSteps = useIsWorkflowStepsCanBeRevised(workflow);

  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 pr-2 !no-underline hover:no-underline">
      <div
        className={ctw('whitespace-nowrap no-underline', {
          ['max-w-[60px] overflow-hidden text-ellipsis']: isShouldDisplayRequestButton,
        })}
        title={isShouldDisplayRequestButton ? 'Collection Flow' : undefined}
      >
        Collection Flow
      </div>
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
