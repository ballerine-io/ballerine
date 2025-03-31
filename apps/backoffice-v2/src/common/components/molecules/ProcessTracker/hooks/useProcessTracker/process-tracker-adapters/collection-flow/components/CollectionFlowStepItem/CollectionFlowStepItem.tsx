import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TCollectionFlowStep } from '@ballerine/common';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import { CollectionFlowStepOptions } from './components/CollectionFlowStepOptions';
import { useIsCurrentStepCanBeRevised } from './hooks/useIsCurrentStepCanBeRevised';
import { useRequestStepFromClient } from './hooks/useRequestStepFromClient';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

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
  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user || null;

  const { onRequestStepFromClient, onCancelStepRequest, isLoading } = useRequestStepFromClient({
    workflowId: workflow.id,
    context: workflow.context,
    step,
  });

  const isCanRequestStep = useIsCurrentStepCanBeRevised({
    authenticatedUser: authenticatedUser,
    workflowAssigneeId: workflow.assigneeId || workflow.assignee?.id,
    workflowConfig: workflow.workflowDefinition.config,
    workflowTags: workflow.tags,
    step,
  });

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
          {!isLoading ? (
            <CollectionFlowStepOptions
              onRequestStepFromClient={onRequestStepFromClient}
              onCancelStep={onCancelStepRequest}
              step={step}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
