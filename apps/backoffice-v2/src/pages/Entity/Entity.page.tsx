import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { BlocksComponent } from '@ballerine/blocks';
import { TaskContainer } from './TaskContainer';

export const Entity = () => {
  const { workflow, selectedEntity, tasks, cells, isLoading } = useEntity();

  // Selected entity
  return (
    <Case>
      {/* Reject and approve header */}
      <Case.Actions
        id={workflow.id}
        fullName={selectedEntity.name}
        avatarUrl={selectedEntity.avatarUrl}
        showResolutionButtons={workflow.workflowDefinition.config?.workflowLevelResolution}
      />
      <Case.Content key={selectedEntity?.id}>
        <BlocksComponent cells={cells} blocks={tasks} Block={TaskContainer}>
          {(Cell, cell) => <Cell {...cell} />}
        </BlocksComponent>
        {!isLoading && !tasks?.length && (
          <div className={`p-2`}>
            <h2 className={`mt-4 text-6xl`}>No tasks were found</h2>
          </div>
        )}
      </Case.Content>
    </Case>
  );
};
