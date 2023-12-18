import { Case } from './components/Case/Case';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';

export const Entity = () => {
  const { BlocksByUiSchemaVariant, workflow, selectedEntity } = useEntityLogic();

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
        <BlocksByUiSchemaVariant />
      </Case.Content>
    </Case>
  );
};
