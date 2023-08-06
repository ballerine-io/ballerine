import { useMemo } from 'react';

export type Flows = 'base' | 'resolving';
export type FlowComponent = React.ComponentType;

interface Props {
  workflowId?: string;
  flowToComponentMap: Record<Flows, FlowComponent>;
}

export const FlowResolver = ({ workflowId, flowToComponentMap }: Props) => {
  const ResolvedFlowComponent = useMemo(() => {
    if (!workflowId) return flowToComponentMap['base'];

    return flowToComponentMap['resolving'];
  }, [workflowId, flowToComponentMap]);

  return <ResolvedFlowComponent />;
};
