import { CollectionFlowProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/collection-flow.process-tracker';
import { MerchantMonitoringProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/merchant-monitoring.process-tracker';
import { ThirdPartyProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/third-party.process-tracker';
import { UBOFlowsProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/ubo-flows.process-tracker';

export const processTrackersMap = {
  'collection-flow': CollectionFlowProcessTracker,
  ubos: UBOFlowsProcessTracker,
  'third-party': ThirdPartyProcessTracker,
  'merchant-monitoring': MerchantMonitoringProcessTracker,
} as const;
