import { useMemo } from 'react';

export type Flows = 'base';
export type FlowComponent = React.ComponentType;

interface Props {
  flowToComponentMap: Record<Flows, FlowComponent>;
}

export const FlowResolver = ({ flowToComponentMap }: Props) => {
  const ResolvedFlowComponent = useMemo(() => {
    return flowToComponentMap['base'];
  }, [flowToComponentMap]);

  return <ResolvedFlowComponent />;
};
