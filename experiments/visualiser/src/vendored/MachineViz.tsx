import React, { useMemo } from 'react';
import { StateNodeViz } from './StateNodeViz';
import { DirectedGraphNode } from './directedGraph';
import { getAllEdges } from './graphUtils';
import { TransitionViz } from './TransitionViz';

export const MachineViz: React.FC<{ digraph: DirectedGraphNode }> = ({
  digraph,
}) => {
  const allEdges = useMemo(() => getAllEdges(digraph), [digraph]);

  return (
    <div style={{ opacity: 0.001 }} data-viz="machine" data-viz-id={digraph.id}>
      <StateNodeViz stateNode={digraph.data} node={digraph} />
      {allEdges.map((edge, i) => {
        return (
          <TransitionViz
            edge={edge}
            key={edge.id}
            index={i}
            position={
              edge.label && {
                x: edge.label.x,
                y: edge.label.y,
              }
            }
          />
        );
      })}
    </div>
  );
};
