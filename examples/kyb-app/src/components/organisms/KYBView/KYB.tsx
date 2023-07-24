import {
  FlowComponent,
  FlowResolver,
  Flows,
} from '@app/components/organisms/KYBView/components/FlowResolver';
import { BaseFlow } from '@app/components/organisms/KYBView/flows/BaseFlow';
import { IssueResolvingFlow } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow';
import { useQueryValues } from '@app/components/organisms/KYBView/hooks/useQueryParams';
import { KYBQueryParams } from '@app/components/organisms/KYBView/types';

const flows: Record<Flows, FlowComponent> = {
  base: BaseFlow,
  resolving: IssueResolvingFlow,
};

export const KYB = () => {
  const { workflowRuntimeId } = useQueryValues<KYBQueryParams>();

  return <FlowResolver workflowId={workflowRuntimeId} flowToComponentMap={flows} />;
};
