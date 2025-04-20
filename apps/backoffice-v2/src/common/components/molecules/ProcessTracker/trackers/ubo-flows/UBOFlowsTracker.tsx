import { TTrackerComponentProps } from '../../components/Tracker/interfaces';
import { Tracker } from '../../components/Tracker/Tracker';
import { UBO_FLOW_PROCESS_NAME } from './consts';
import { useUBOFlowsTrackerItems } from './hooks/useUBOFlowsTrackerItems';

export const UBOFlowsTracker = ({ workflow, plugins, processes }: TTrackerComponentProps) => {
  const items = useUBOFlowsTrackerItems(workflow?.childWorkflows);

  return (
    <Tracker workflow={workflow} plugins={plugins} processes={processes}>
      <Tracker.Item title="UBO flows" value={UBO_FLOW_PROCESS_NAME} subitems={items} />
    </Tracker>
  );
};
