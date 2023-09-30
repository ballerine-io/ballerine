import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { ctw } from '../../common/utils/ctw/ctw';
import { Card } from '../../common/components/atoms/Card/Card';
import { CardContent } from '../../common/components/atoms/Card/Card.Content';
import { KycBlock } from './components/KycBlock/KycBlock';
import { NoTasksSvg } from '../../common/components/atoms/icons';

export const Entity = () => {
  const { workflow, selectedEntity, tasks, cells, isLoading } = useEntity();

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
        {Array.isArray(tasks) &&
          tasks?.length > 0 &&
          tasks?.map((task, index) => {
            if (!Array.isArray(task?.cells) || !task?.cells?.length) return;

            return (
              <Card
                key={index}
                className={ctw(
                  'me-4 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]',
                  task.className,
                )}
              >
                <CardContent
                  className={ctw('grid gap-2', {
                    'grid-cols-2': task?.cells.some(field => field?.type === 'multiDocuments'),
                  })}
                >
                  {task?.cells.map((field, index) => {
                    const Cell = cells[field?.type];

                    return <Cell key={index} {...field} />;
                  })}
                </CardContent>
              </Card>
            );
          })}
        {Array.isArray(workflow?.childWorkflows) &&
          workflow?.childWorkflows?.length > 0 &&
          workflow?.childWorkflows?.map(childWorkflow => (
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
