import { IProcessTracker } from './interfaces';
import { CollectionFlowTracker } from './trackers/collection-flow';
import { COLLECTION_FLOW_PROCESS_NAME } from './trackers/collection-flow/consts';
import { MerchantMonitoringTracker } from './trackers/merchant-monitoring';
import { MERCHANT_MONITORING_PROCESS_NAME } from './trackers/merchant-monitoring/consts';
import { ThirdPartyTracker } from './trackers/third-party';
import { THIRD_PARTY_PROCESS_NAME } from './trackers/third-party/consts';
import { UBOFlowsTracker } from './trackers/ubo-flows';
import { UBO_FLOW_PROCESS_NAME } from './trackers/ubo-flows/consts';

export const PROCESS_TRACKERS: IProcessTracker[] = [
  {
    name: COLLECTION_FLOW_PROCESS_NAME,
    Component: CollectionFlowTracker,
  },
  {
    name: THIRD_PARTY_PROCESS_NAME,
    Component: ThirdPartyTracker,
  },
  {
    name: UBO_FLOW_PROCESS_NAME,
    Component: UBOFlowsTracker,
  },
  {
    name: MERCHANT_MONITORING_PROCESS_NAME,
    Component: MerchantMonitoringTracker,
  },
] as const;
