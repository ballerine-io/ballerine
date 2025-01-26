import { stratify, tree } from 'd3-hierarchy';

export const getLayoutedElements = ({
  nodes,
  edges,
}: {
  nodes: Array<{
    id: string;
    data: {
      label: string;
    };
    position: {
      x: 0;
      y: 0;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    animated: boolean;
  }>;
}) => {
  if (!nodes.length) {
    return { nodes, edges };
  }

  const hierarchy = stratify<(typeof nodes)[number]>()
    .id(node => node.id)
    .parentId(node => edges.find(edge => edge.target === node.id)?.source);
  const root = hierarchy(nodes);
  const treeLayout = tree<(typeof nodes)[number]>();
  const layout = treeLayout.nodeSize([200, 200])(root);

  return {
    nodes: layout
      .descendants()
      .map(node => ({ ...node.data, position: { x: node.x, y: 200 - node.y } })),
    edges,
  };
};
