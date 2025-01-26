import { getLayoutedElements } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/get-layouted-elements';

export const buildTree = ({
  nodes,
  edges,
}: {
  nodes: Array<{
    id: string;
    data: {
      name: string;
      type: string;
      sharePercentage?: number;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data: {
      sharePercentage?: number;
    };
  }>;
}) => {
  const formattedNodes = nodes.map(node => {
    const percentage = node?.data?.sharePercentage
      ? Number(node?.data?.sharePercentage).toFixed(2)
      : undefined;

    return {
      id: node.id,
      type: 'customNode',
      data: {
        label: `${node.data.name} (${node.data.type})`,
        sharePercentage: percentage
          ? `${percentage.toString().endsWith('%') ? percentage : `${percentage}%`}`
          : undefined,
      },
      position: {
        x: 0 as const,
        y: 0 as const,
      },
    };
  });
  const formattedEdges = edges.map(edge => {
    const percentage = edge?.data?.sharePercentage
      ? Number(edge?.data?.sharePercentage).toFixed(2)
      : undefined;

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      ...(percentage
        ? {
            label: percentage.toString().endsWith('%') ? percentage : `${percentage}%`,
          }
        : {}),
      animated: true,
    };
  });

  return getLayoutedElements({ nodes: formattedNodes, edges: formattedEdges });
};
