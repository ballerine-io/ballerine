import { Case } from './components/Case/Case';
import { Notes } from './components/Notes/Notes';
import { useNotes } from '@/domains/notes/hooks/useNotes';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { BlocksVariant } from '@/lib/blocks/variants/BlocksVariant/BlocksVariant';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';
import { SidebarInset, SidebarProvider } from '@/pages/Entity/components/Notes/Sidebar';

export const Entity = () => {
  const { workflow, notes, selectedEntity } = useEntityLogic();
  const { isNotesOpen } = useNotes();

  if (!workflow) {
    return null;
  }

  // Selected entity
  return (
    <SidebarProvider
      open={isNotesOpen}
      style={{
        '--sidebar-width': '25rem',
        '--sidebar-width-mobile': '20rem',
      }}
    >
      <SidebarInset>
        <Case key={workflow?.id}>
          {/* Reject and approve header */}
          <Case.Actions
            numberOfNotes={notes?.length ?? 0}
            id={workflow?.id}
            fullName={selectedEntity?.name}
            avatarUrl={selectedEntity?.avatarUrl}
            showResolutionButtons={
              workflow?.workflowDefinition?.config?.workflowLevelResolution ??
              workflow?.context?.entity?.type === 'business'
            }
            workflow={workflow as TWorkflowById}
          />
          <Case.Content key={selectedEntity?.id}>
            {workflow?.workflowDefinition && (
              <BlocksVariant
                workflowDefinition={{
                  version: workflow?.workflowDefinition?.version,
                  variant: workflow?.workflowDefinition?.variant,
                  config: workflow?.workflowDefinition?.config,
                  name: workflow?.workflowDefinition?.name,
                }}
              />
            )}
          </Case.Content>
        </Case>
      </SidebarInset>
      <Notes
        notes={notes}
        displayName={workflow.entity.name}
        entityId={workflow.entity.id}
        entityType={`Business`}
        noteableId={workflow.id}
        noteableType={`Workflow`}
      />
    </SidebarProvider>
  );
};
