import { TTrackerComponentProps } from './components/Tracker/interfaces';
import { CollectionFlowTracker } from './trackers/collection-flow';
import { COLLECTION_FLOW_PROCESS_NAME } from './trackers/collection-flow/consts';
import { MerchantMonitoringTracker } from './trackers/merchant-monitoring';
import { MERCHANT_MONITORING_PROCESS_NAME } from './trackers/merchant-monitoring/consts';
import { ThirdPartyTracker } from './trackers/third-party';
import { THIRD_PARTY_PROCESS_NAME } from './trackers/third-party/consts';
import { UBOFlowsTracker } from './trackers/ubo-flows';
import { UBO_FLOW_PROCESS_NAME } from './trackers/ubo-flows/consts';

export const PROCESS_TRACKERS = {
  [COLLECTION_FLOW_PROCESS_NAME]: CollectionFlowTracker,
  [THIRD_PARTY_PROCESS_NAME]: ThirdPartyTracker,
  [UBO_FLOW_PROCESS_NAME]: UBOFlowsTracker,
  [MERCHANT_MONITORING_PROCESS_NAME]: MerchantMonitoringTracker,
} as const satisfies Record<string, React.ComponentType<TTrackerComponentProps>>;
