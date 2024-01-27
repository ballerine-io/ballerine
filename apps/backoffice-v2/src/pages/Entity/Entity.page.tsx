import { Case } from './components/Case/Case';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';
import { BlocksVariant } from '@/lib/blocks/variants/BlocksVariant/BlocksVariant';

import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';

export const Entity = () => {
  const { workflow, selectedEntity, plugins } = useEntityLogic();

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
        {workflow?.workflowDefinition?.config?.isCaseOverviewEnabled && (
          <ProcessTracker
            tags={workflow?.tags ?? []}
            plugins={plugins}
            context={workflow?.context}
            childWorkflows={workflow?.childWorkflows ?? []}
          />
        )}
        {workflow?.workflowDefinition && (
          <BlocksVariant
            workflowDefinition={{
              version: workflow?.workflowDefinition?.version,
              variant: workflow?.workflowDefinition?.variant,
              config: workflow?.workflowDefinition?.config,
            }}
          />
        )}
      </Case.Content>
    </Case>
  );
};
