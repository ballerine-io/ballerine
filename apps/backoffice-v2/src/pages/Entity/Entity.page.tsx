import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { ctw } from '../../common/utils/ctw/ctw';
import { Card } from '../../common/components/atoms/Card/Card';
import { CardContent } from '../../common/components/atoms/Card/Card.Content';

export const Entity = () => {
  const { selectedEntity, tasks, components, isLoading } = useEntity();

  // Selected entity
  return (
    <Case>
      {/* Reject and approve header */}
      <Case.Actions
        id={selectedEntity?.id}
        fullName={selectedEntity?.fullName}
        avatarUrl={selectedEntity?.avatarUrl}
        showResolutionButtons={selectedEntity.workflow?.config?.workflowLevelResolution}
      />
      <Case.Content key={selectedEntity?.id}>
        {Array.isArray(tasks) &&
          tasks?.length > 0 &&
          tasks?.map((task, index) => (
            <Card key={index} className={`me-4`}>
              <CardContent
                className={ctw('grid gap-2', {
                  'grid-cols-2': task?.some(field => field?.type === 'multiDocuments'),
                })}
              >
                {task?.map((field, index) => {
                  const Cell = components[field?.type];

                  return <Cell key={index} {...field} />;
                })}
              </CardContent>
            </Card>
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
