import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { ctw } from '../../common/utils/ctw/ctw';
import { Card } from '../../common/components/atoms/Card/Card';
import { CardContent } from '../../common/components/atoms/Card/Card.Content';
import { KycBlock } from './components/KycBlock/KycBlock';

export const Entity = () => {
  const { workflow, selectedEntity, tasks, cells, isLoading } = useEntity();

  // Selected entity
  return (
    <Case>
      {/* Reject and approve header */}
      <Case.Actions
        id={workflow?.id}
        fullName={selectedEntity?.name}
        avatarUrl={selectedEntity?.avatarUrl}
        showResolutionButtons={workflow?.workflowDefinition?.config?.workflowLevelResolution}
      />
      <Case.Content key={selectedEntity?.id}>
        {Array.isArray(tasks) &&
          tasks?.length > 0 &&
          tasks?.map((task, index) => {
            if (!Array.isArray(task) || !task?.length) return;

            return (
              <Card key={index} className={`me-4`}>
                <CardContent
                  className={ctw('grid gap-2', {
                    'grid-cols-2': task?.some(field => field?.type === 'multiDocuments'),
                  })}
                >
                  {task?.map((field, index) => {
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
          <div className={`p-2`}>
            <h2 className={`mt-4 text-6xl`}>No tasks were found</h2>
          </div>
        )}
      </Case.Content>
    </Case>
  );
};
