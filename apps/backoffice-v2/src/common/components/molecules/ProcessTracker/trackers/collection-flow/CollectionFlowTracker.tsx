import { TTrackerComponentProps } from '../../components/Tracker/interfaces';
import { Tracker } from '../../components/Tracker/Tracker';
import { CollectionFlowProcessTitle } from './components/CollectionFlowStepItem/components/CollectionFlowProcessTitle';
import { COLLECTION_FLOW_PROCESS_NAME } from './consts';
import { useCollectionFlowSteps } from './hooks/useCollectionFlowSteps';
import { useCollectionFlowTrackerItems } from './hooks/useCollectionFlowTrackerItems';

export const CollectionFlowTracker = ({ workflow, plugins, processes }: TTrackerComponentProps) => {
  const steps = useCollectionFlowSteps({ workflowContext: workflow.context });
  const items = useCollectionFlowTrackerItems({ steps, workflow });

  return (
    <Tracker workflow={workflow} plugins={plugins} processes={processes}>
      <Tracker.Item
        accordionTriggerProps={{ className: 'hover:no-underline' }}
        title={<CollectionFlowProcessTitle />}
        value={COLLECTION_FLOW_PROCESS_NAME}
        subitems={items}
      />
    </Tracker>
  );
};
