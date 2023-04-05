import { DirectedGraphNode } from './directedGraph';
import { useMachine, useSelector } from '@xstate/react';
import { useEffect, useMemo, memo } from 'react';
import { Edges } from './Edges';
import { StateNodeViz } from './StateNodeViz';
import { TransitionViz } from './TransitionViz';
import { createElkMachine } from './elkMachine';
import { MachineViz } from './MachineViz';
import { useCanvas } from './CanvasContext';
import { useSimulation } from './SimulationContext';
import { getAllEdges, StateElkNode } from './graphUtils';
import React from 'react';

const GraphNode: React.FC<{ elkNode: StateElkNode }> = ({ elkNode }) => {
  return <StateNodeViz stateNode={elkNode.node.data} node={elkNode.node} />;
};

const MemoizedEdges = memo(Edges);
const MemoizedGraphNode = memo(GraphNode);
const MemoizedTransitionViz = memo(TransitionViz);
const MemoizedMachineViz = memo(MachineViz);

export const Graph: React.FC<{ digraph: DirectedGraphNode }> = ({ digraph }) => {
  const sim = useSimulation();
  const [state, send] = useMachine(() => createElkMachine(digraph), {
    actions: {
      notifyLayoutPending: () => {
        sim.send('LAYOUT.PENDING');
      },
      notifyLayoutReady: () => {
        sim.send('LAYOUT.READY');
      },
    },
  });

  const canvasService = useCanvas();
  const { viewbox, zoom } = useSelector(canvasService, s => s.context);

  useEffect(() => {
    send({ type: 'GRAPH_UPDATED', digraph });
  }, [digraph, send]);

  useEffect(() => {
    // Let canvas service know that the elk graph updated for zoom-to-fit, centering, etc.
    canvasService.send({
      type: 'elkGraph.UPDATE',
      elkGraph: state.context.elkGraph!,
    });
  }, [state.context.elkGraph]);

  const allEdges = useMemo(() => getAllEdges(digraph), [digraph]);

  if (state.matches('success')) {
    return (
      <div
        data-testid="canvas-graph"
        style={{
          transformOrigin: '0 0',
          // Since our layout is LTR, it's more predictable for zoom to happen from top left point
          transform: `translate3d(${-viewbox.minX}px, ${-viewbox.minY}px, 0) scale(${zoom})`,
        }}
      >
        <MemoizedEdges digraph={digraph} />
        <MemoizedGraphNode
          elkNode={
            // Get the machine node, not the root node
            state.context.elkGraph!.children![0]!
          }
        />
        {allEdges.map((edge, i) => {
          return (
            <MemoizedTransitionViz
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
  }

  return <MemoizedMachineViz digraph={digraph} />;
};
