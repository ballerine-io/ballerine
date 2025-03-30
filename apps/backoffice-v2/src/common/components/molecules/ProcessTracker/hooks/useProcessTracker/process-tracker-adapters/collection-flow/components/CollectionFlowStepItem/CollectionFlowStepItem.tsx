import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TCollectionFlowStep } from '@ballerine/common';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import { CollectionFlowStepOptions } from './components/CollectionFlowStepOptions';
import { useIsCanRequestStep } from './hooks/useIsCanRequestStep';
import { useRequestStepFromClient } from './hooks/useRequestStepFromClient';

export interface ICollectionFlowStepItemProps {
  leftIcon: JSX.Element;
  step: TCollectionFlowStep;
  workflow: TWorkflowById;
}
export const CollectionFlowStepItem = ({
  leftIcon,
  step,
  workflow,
}: ICollectionFlowStepItemProps) => {
  const { onRequestStepFromClient, onCancelStepRequest, isLoading } = useRequestStepFromClient({
    workflow,
    step,
  });
  const isCanRequestStep = useIsCanRequestStep(workflow, step);

  return (
    <div className="group flex w-full flex-row justify-between">
      <div className="flex flex-row flex-nowrap items-center gap-x-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">{leftIcon}</span>
            </TooltipTrigger>
            {step.reason && (
              <TooltipContent sideOffset={5} className="border border-gray-200 bg-white text-black">
                <p>{step.reason}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {titleCase(step.stepName)}
      </div>
      {isCanRequestStep ? (
        <div className="invisible pr-3 group-hover:visible">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <CollectionFlowStepOptions
              onRequestStepFromClient={onRequestStepFromClient}
              onCancelStep={onCancelStepRequest}
              step={step}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
