import React from 'react';
import { EdgeViz } from './EdgeViz';
import { getAllEdges } from './graphUtils';
import { DirectedGraphNode } from './directedGraph';
import { InitialEdgeViz } from './InitialEdgeViz';

function getInitialDigraphNodes(
  digraph: DirectedGraphNode,
): DirectedGraphNode[] {
  const nodes: DirectedGraphNode[] = [];
  if (digraph.data.parent?.initial === digraph.data.key) {
    nodes.push(digraph);
  }

  digraph.children.forEach((childNode) => {
    nodes.push(...getInitialDigraphNodes(childNode));
  });

  return nodes;
}

export const Edges: React.FC<{ digraph: DirectedGraphNode }> = ({
  digraph,
}) => {
  const edges = getAllEdges(digraph);
  const initialNodes = getInitialDigraphNodes(digraph);
  return (
    <svg
      style={{
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {initialNodes.map((initialNode) => {
        return <InitialEdgeViz node={initialNode} key={initialNode.id} />;
      })}
      {edges.map((edge, i) => {
        return <EdgeViz key={edge.id} edge={edge} order={i} />;
      })}
    </svg>
  );
};
