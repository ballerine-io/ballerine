import { TTrackerComponentProps } from '../../components/Tracker/interfaces';
import { Tracker } from '../../components/Tracker/Tracker';
import { THIRD_PARTY_PROCESS_NAME } from './consts';
import { useThirdPartyTrackerItems } from './hooks/useThirdPartyTrackerItems/useThirdPartyTrackerItems';

export const ThirdPartyTracker = ({ workflow, plugins, processes }: TTrackerComponentProps) => {
  const items = useThirdPartyTrackerItems({
    workflowPluginsOutput: workflow?.context?.pluginsOutput,
    workflowPlugins: plugins,
  });

  return (
    <Tracker workflow={workflow} plugins={plugins} processes={processes}>
      <Tracker.Item
        title="3rd party processes"
        name={THIRD_PARTY_PROCESS_NAME}
        value={THIRD_PARTY_PROCESS_NAME}
        subitems={items}
      />
    </Tracker>
  );
};
