import { useSelector } from '@xstate/react';
import * as React from 'react';
import { ArrowMarker } from './ArrowMarker';
import { DirectedGraphNode } from './directedGraph';
import { Point } from './pathUtils';
import { useSimulation } from './SimulationContext';

export const InitialEdgeViz: React.FC<{ node: DirectedGraphNode }> = ({ node }) => {
  const service = useSimulation();
  const isActive = useSelector(service, state => {
    return state.context.serviceDataMap[
      state.context.currentSessionId!
    ]?.state.configuration.includes(node.data);
  });
  if (!node.absolute) {
    return null;
  }

  const endPoint: Point = {
    x: node.absolute.x - 10,
    y: node.absolute.y + 10,
  };

  const startPoint: Point = {
    x: endPoint.x - 5,
    y: endPoint.y - 10,
  };

  const markerId = `n${Math.floor(Math.random() * 1000)}`;

  return (
    <g data-viz="edgeGroup" data-viz-active={isActive || undefined}>
      <defs>
        <ArrowMarker id={markerId} />
      </defs>
      <circle
        data-viz="initialEdge-circle"
        r="4"
        cx={startPoint.x}
        cy={startPoint.y}
        fill="var(--stroke)"
      />
      <path
        data-viz="edge"
        d={`M ${startPoint.x},${startPoint.y} Q ${startPoint.x},${endPoint.y} ${endPoint.x},${
          endPoint.y
        } L ${endPoint.x + 1}, ${endPoint.y}`}
        stroke="var(--stroke)"
        strokeWidth={2}
        fill="none"
        markerEnd={`url(#${markerId})`}
        pathLength={1}
      />
    </g>
  );
};
