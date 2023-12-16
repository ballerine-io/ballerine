import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { KycBlock } from './components/KycBlock/KycBlock';
import { NoTasksSvg } from '../../common/components/atoms/icons';
import { ChildDocumentBlocks } from '@/pages/Entity/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { BlocksComponent } from '@ballerine/blocks';

export const Entity = () => {
  const {
    workflow,
    selectedEntity,
    tasks,
    cells,
    isLoading,
    kycChildWorkflows,
    kybChildWorkflows,
    parentMachine,
  } = useEntity();
  console.log({ tasks });

  // Selected entity
  return (
    <Case key={workflow?.id}>
      {/* Reject and approve header */}
      <Case.Actions
        id={workflow?.id}
        fullName={selectedEntity?.name}
        avatarUrl={selectedEntity?.avatarUrl}
        showResolutionButtons={
          workflow?.workflowDefinition?.config?.workflowLevelResolution ??
          workflow?.context?.entity?.type === 'business'
        }
      />
      <Case.Content key={selectedEntity?.id}>
        <BlocksComponent blocks={tasks} cells={cells}>
          {(Cell, cell) => <Cell {...cell} />}
        </BlocksComponent>
        {kybChildWorkflows?.map(childWorkflow => (
          <ChildDocumentBlocks
            parentWorkflowId={workflow?.id}
            childWorkflow={childWorkflow}
            parentMachine={parentMachine}
            key={childWorkflow?.id}
          />
        ))}
        {Array.isArray(kycChildWorkflows) &&
          kycChildWorkflows?.length > 0 &&
          kycChildWorkflows?.map(childWorkflow => (
            <KycBlock
              parentWorkflowId={workflow?.id}
              childWorkflow={childWorkflow}
              key={childWorkflow?.id}
            />
          ))}
        {!isLoading && !tasks?.length && (
          <div className="mb-72 flex items-center justify-center border-l-[1px] p-4">
            <div className="inline-flex flex-col  items-start gap-4 rounded-md border-[1px] border-[#CBD5E1] p-6">
              <div className="flex w-[464px] items-center justify-center">
                <NoTasksSvg width={80} height={91} />
              </div>

              <div className="flex w-[464px] flex-col items-start gap-2">
                <h2 className="text-lg font-[600]">No tasks found</h2>

                <div className="text-sm leading-[20px]">
                  <p className="font-[400]">
                    It looks like there aren&apos;t any tasks in your selected case right now.
                  </p>

                  <div className="mt-[20px] flex flex-col">
                    <span className="font-[700]">What can you do now?</span>

                    <ul className="list-disc pl-6 pr-2">
                      <li>Make sure to refresh or check back often for new tasks.</li>
                      <li>Ensure other cases aren&apos;t empty as well.</li>
                      <li>
                        If you suspect a technical issue, reach out to your technical team to
                        diagnose the issue.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Case.Content>
    </Case>
  );
};
