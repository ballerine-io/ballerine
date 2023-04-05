import { useSelector } from '@xstate/react';
import React from 'react';
import { roundPath, LPathParam, pathToD, Point, SvgPath } from './pathUtils';
import { ArrowMarker } from './ArrowMarker';
import { DirectedGraphEdge } from './directedGraph';
import { useSimulation } from './SimulationContext';

function translatePoint(point: Point, vector: Point): Point {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y,
  };
}

export function translate(path: SvgPath, vector: Point): SvgPath {
  return path.map(cmd => {
    switch (cmd[0]) {
      case 'M':
        return ['M', translatePoint(cmd[1], vector)];
      case 'L':
        return ['L', translatePoint(cmd[1], vector)];
      default:
        return cmd;
    }
  }) as SvgPath;
}

export const EdgeViz: React.FC<{ edge: DirectedGraphEdge; order: number }> = ({ edge, order }) => {
  const service = useSimulation();
  const isActive = useSelector(service, state => {
    return state.context.serviceDataMap[
      state.context.currentSessionId!
    ]?.state.configuration.includes(edge.source);
  });

  let path: SvgPath | undefined;

  if (edge.sections.length) {
    const section = edge.sections[0];

    path = [
      ['M', section.startPoint],
      ...(section.bendPoints?.map((point: Point) => ['L', point] as LPathParam) || []),
    ];

    const preLastPoint = path[path.length - 1][1]!;
    const xSign = Math.sign(section.endPoint.x - preLastPoint.x);
    const ySign = Math.sign(section.endPoint.y - preLastPoint.y);
    const endPoint = {
      x: section.endPoint.x - 5 * xSign,
      y: section.endPoint.y - 5 * ySign,
    };
    path.push(['L', endPoint]);
  }

  const markerId = `${edge.source.order}-${order}`;

  return path ? (
    <g data-viz="edgeGroup" data-viz-edge={edge.id} data-viz-active={isActive || undefined}>
      <defs>
        <ArrowMarker id={markerId} />
      </defs>
      <path
        stroke="#fff4"
        strokeWidth={2}
        fill="none"
        d={pathToD(roundPath(path))}
        data-viz="edge"
        markerEnd={`url(#${markerId})`}
      ></path>
    </g>
  ) : null;
};
