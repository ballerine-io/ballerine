import {
  FlowComponent,
  FlowResolver,
  Flows,
} from '@app/components/organisms/KYBView/components/FlowResolver';
import { BaseFlow } from '@app/components/organisms/KYBView/flows/BaseFlow';

const flows: Record<Flows, FlowComponent> = {
  base: BaseFlow,
};

export const KYB = () => {
  return <FlowResolver flowToComponentMap={flows} />;
};
