import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { Blocks, createBlocks } from '@ballerine/blocks';
import { TaskContainer } from './TaskContainer';

declare module '@ballerine/blocks' {
  interface Blocks {
    cells: typeof createBlocks<
      | {
          type: 'heading';
          heading: string;
        }
      | {
          type: 'nestedDetails';
          nestedDetails: string;
        }
    >;
  }
}

declare module '@ballerine/blocks' {
  interface Blocks {
    cells: typeof createBlocks<
      | {
          type: 'heading';
          heading: string;
        }
      | {
          type: 'nestedDetails';
          nestedDetails: string;
        }
    >;
  }
}

export const Entity = () => {
  const { workflow, selectedEntity, tasks, cells, isLoading } = useEntity();
  const testBuilder = createBlocks<
    | {
        type: 'heading';
        heading: string;
      }
    | {
        type: 'nestedDetails';
        nestedDetails: string;
      }
  >();
  const tests = testBuilder
    .addBlock()
    .addCell({
      heading: 'test',
      type: 'heading',
      keyProp: 'key',
      key: 'key1',
    })
    .addCell({
      nestedDetails: 'test',
      type: 'nestedDetails',
      keyProp: 'key',
      key: 'key2',
    })
    .build();

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
        <Blocks cells={cells} blocks={tests} Block={TaskContainer}>
          {(Cell, cell) => <Cell {...cell} />}
        </Blocks>
        {!isLoading && !tasks?.length && (
          <div className={`p-2`}>
            <h2 className={`mt-4 text-6xl`}>No tasks were found</h2>
          </div>
        )}
      </Case.Content>
    </Case>
  );
};
