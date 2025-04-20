import { TTrackerComponentProps } from '../../components/Tracker/interfaces';
import { Tracker } from '../../components/Tracker/Tracker';
import { MERCHANT_MONITORING_PROCESS_NAME } from './consts';
import { useMerchantMonitoringTrackerItems } from './hooks/useMerchantMonitoringTrackerItems';

export const MerchantMonitoringTracker = ({
  workflow,
  plugins,
  processes,
}: TTrackerComponentProps) => {
  const items = useMerchantMonitoringTrackerItems({ workflowTags: workflow.tags });

  return (
    <Tracker workflow={workflow} plugins={plugins} processes={processes}>
      <Tracker.Item
        title="Merchant Monitoring"
        value={MERCHANT_MONITORING_PROCESS_NAME}
        subitems={items}
      />
    </Tracker>
  );
};
